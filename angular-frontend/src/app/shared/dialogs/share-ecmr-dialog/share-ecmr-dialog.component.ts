/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { EcmrService } from '../../services/ecmr.service';

import { UserService } from '../../services/user.service';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { catchError, filter, map, of, startWith, Subscription } from 'rxjs';
import { EcmrShare } from '../../../core/models/EcmrShare';
import { ShareEcmrResult } from '../../../core/enums/ShareEcmrResult';
import { MatTooltip } from '@angular/material/tooltip';
import { environment } from '../../../../environments/environment';
import { ExternalUserService } from '../../../features/ecmr-editor/ecmr-editor-service/external-user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { GroupService } from '../../../features/group/group.service';
import { GroupFlat } from '../../../core/models/GroupFlat';
import { EcmrShareWithGroup } from '../../../core/models/EcmrShareWithGroup';
import { SealedDocumentWithoutEcmr } from '../../../core/models/SealedDocumentWithoutEcmr';
import { LoadingService } from '../../../core/services/loading.service';

export enum SearchMode {
    EMAIL = 'Email',
    GROUP = 'Group'
}

interface SearchConfig {
    mode: SearchMode;
    icon: string;
    labelKey: string;
}

@Component({
    selector: 'app-share-ecmr-dialog',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        TranslateModule,
        MatButtonToggleGroup,
        MatButtonToggle,
        MatFormFieldModule,
        MatInput,
        ReactiveFormsModule,
        MatIcon,
        MatIconButton,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatTooltip,
        MatRadioModule,
        FormsModule,
        MatMenuModule,
        MatSelectModule,
        QRCodeComponent
    ],
    templateUrl: './share-ecmr-dialog.component.html',
    styleUrl: './share-ecmr-dialog.component.scss'
})
export class ShareEcmrDialogComponent implements OnInit {
    data = inject<{
        ecmr: Ecmr;
        sealedDocument: SealedDocumentWithoutEcmr;
        roles: EcmrRole[];
        isExternalUser: boolean;
        userToken: string;
        tan: string;
    }>(MAT_DIALOG_DATA);
    dialogRef = inject<MatDialogRef<ShareEcmrDialogComponent>>(MatDialogRef);
    private snackBarService = inject(SnackbarService);
    private ecmrService = inject(EcmrService);
    private breakpointObserver = inject(BreakpointObserver);
    private userService = inject(UserService);
    private externalUserService = inject(ExternalUserService);
    private groupService = inject(GroupService);
    private loadingService = inject(LoadingService);


    emailFormControl = new FormControl<string>('', Validators.required)
    groupFormControl = new FormControl<string | GroupFlat>('', Validators.required)
    protected readonly EcmrRole = EcmrRole;

    @ViewChild('qrcodeElement', {static: true}) qrcodeElement: QRCodeComponent;

    ecmr: Ecmr;
    sealedDocument: SealedDocumentWithoutEcmr;
    ecmrToken: string;
    ecmrRoles: EcmrRole[];

    userList: string[] = [];
    filteredUserList: string[] = [];
    groupList: GroupFlat[] = [];
    filteredGroupList: GroupFlat[] = [];

    readonly searchOptionsMap: { [key in SearchMode]: SearchConfig } = {
        [SearchMode.EMAIL]: {mode: SearchMode.EMAIL, icon: 'email', labelKey: 'share_ecmr_dialog.email'},
        [SearchMode.GROUP]: {mode: SearchMode.GROUP, icon: 'groups', labelKey: 'common.group'},

    };
    SearchMode = SearchMode;
    selectedSearch = this.searchOptionsMap.Email;
    canSelectSearch = false;

    externalUserShareString = `${location.origin}/external-user-registration`;
    readerShareString = `${environment.backendUrl}/anonymous/ecmr`
    shareString = '';
    currentRole: EcmrRole;
    isExternalUser: boolean;
    tan: string;
    userToken: string;

    private breakpointSubscription: Subscription | undefined;
    isMobile: boolean;

    senderSharable:boolean = false;
    carrierSharable: boolean = false;
    consigneeSharable: boolean = false;

    constructor() {
        const data = this.data;

        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe(result => {
                this.isMobile = result.matches;
            });

        if (data) {
            this.ecmr = data.ecmr;
            this.sealedDocument = data.sealedDocument;
            this.ecmrRoles = data.roles;
            this.isExternalUser = data.isExternalUser;
            this.tan = data.tan
            this.userToken = data.userToken;
            this.setSharableRoles()
            this.setInitialRole();
            if (!this.isExternalUser) {
                this.userService.getAllUserMail().subscribe(userResult => {
                    this.userList = userResult;
                })
                this.groupService.getAllGroupsAsFlatList(false).subscribe(groupResult => {
                    this.groupList = groupResult;
                    this.canSelectSearch = this.groupList.length > 0;
                })
            }
        }
    }

    private setSharableRoles() {
        const canShare = (requiredRoles: EcmrRole[], sealKey: keyof typeof this.sealedDocument, excludeRole?: EcmrRole) => {
            const hasRole = requiredRoles.some(role => this.ecmrRoles.includes(role));
            const sealEmpty = !this.sealedDocument || this.sealedDocument[sealKey] === null;
            const externalCheck = this.isExternalUser ? !this.ecmrRoles.includes(excludeRole!) : true;
            return hasRole && sealEmpty && externalCheck;
        };

        this.senderSharable = canShare([EcmrRole.Sender], 'senderSeal', EcmrRole.Sender);
        this.carrierSharable = canShare([EcmrRole.Sender, EcmrRole.Carrier], 'carrierSeal', EcmrRole.Carrier);
        this.consigneeSharable = canShare([EcmrRole.Sender, EcmrRole.Carrier, EcmrRole.Consignee], 'consigneeSeal', EcmrRole.Consignee);
    }

    private setInitialRole() {
        if (this.senderSharable) {
            this.changeRole(EcmrRole.Sender)
        } else if (this.carrierSharable) {
            this.changeRole(EcmrRole.Carrier)
        } else if (this.consigneeSharable) {
            this.changeRole(EcmrRole.Consignee)
        } else {
            this.changeRole(EcmrRole.Reader)
        }
    }

    ngOnInit() {
        this.filteredUserList = this.userList;
        this.emailFormControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value!))
            )
            .subscribe(filteredUsers => {
                this.filteredUserList = filteredUsers;
            });

        this.filteredGroupList = this.groupList;
        this.groupFormControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterGroups(value!))
            )
            .subscribe(filteredGroups => {
                this.filteredGroupList = filteredGroups;
            });
    }

    preventInputFocusOnMenuClick(event: MouseEvent) {
        event.stopPropagation();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.userList.filter(mail =>
            mail.toLowerCase().includes(filterValue)
        );
    }

    private _filterGroups(value: string | GroupFlat): GroupFlat[] {
        const filterValue = (typeof value === 'string' ? value : value!.name).toLowerCase();
        return this.groupList.filter(group =>
            group.name.toLowerCase().includes(filterValue)
            || group.description?.toLocaleLowerCase().includes(filterValue)
        );
    }

    displayGroupFn(group: GroupFlat): string {
        return group && group.name ? group.name : '';
    }

    getSelectedGroupOption(): GroupFlat | null {
        return (this.groupFormControl.value && typeof this.groupFormControl.value !== 'string') ?
            this.groupFormControl.value : null
    }

    share() {
        const shareResult$ = (this.selectedSearch.mode === SearchMode.EMAIL ? this.shareByEmail() : this.shareByGroup());
        if (shareResult$) {
            this.loadingService.showLoaderUntilCompleted(shareResult$.pipe(
                catchError(err => {
                    console.error(err);
                    if (err.status === 501) {
                        this.snackBarService.openErrorSnackbar('error.not_implemented');
                    }
                    else if (err.status === 400) {
                        this.snackBarService.openErrorSnackbar('share_ecmr_dialog.error_400');
                    }
                    else {
                        this.snackBarService.openErrorSnackbar('general.snackbar_error')
                    }
                    return of(null)
                }),
                filter(result => result?.result != null),
                map(result => result)
            )).subscribe(response => {
                if (response?.result) {
                    const shareResult: ShareEcmrResult = response.result;
                    switch (shareResult) {
                        case ShareEcmrResult.SharedExternal:
                            if(response.url) {
                                this.snackBarService.openSuccessSnackbarWithTranslationValue('share_ecmr_dialog.shared_external_instance', response.url);
                            } else {
                                this.snackBarService.openSuccessSnackbar('share_ecmr_dialog.shared_external');
                            }
                            this.dialogRef.close()
                            break;
                        case ShareEcmrResult.SharedInternal:
                            this.snackBarService.openSuccessSnackbarWithTranslationValue('share_ecmr_dialog.shared_internal', response.group.name);
                            this.dialogRef.close()
                            break;
                        case ShareEcmrResult.ErrorInternalUserHasNoGroup:
                            this.snackBarService.openErrorSnackbar('share_ecmr_dialog.user_has_no_group');
                            break;
                        case ShareEcmrResult.ErrorSealMandatoryForExternal:
                            this.snackBarService.openErrorSnackbar('share_ecmr_dialog.seal_mandatory_for_external');
                            break;
                        case ShareEcmrResult.ErrorPreviousSealMandatoryForExternalInstance:
                            this.snackBarService.openErrorSnackbar('share_ecmr_dialog.previous_seal_mandatory_for_external_instance');
                            break;
                    }
                }
            })
        }
    }

    private shareByEmail() {
        if (this.emailFormControl.valid && this.emailFormControl.value && this.currentRole && this.ecmr?.ecmrId) {
            const ecmrShare: EcmrShare = {
                role: this.currentRole,
                email: this.emailFormControl.value
            };

            if (this.isExternalUser) {
                return this.externalUserService.shareEcmr(ecmrShare, this.ecmr.ecmrId, this.userToken, this.tan);
            }
            return this.ecmrService.shareEcmr(ecmrShare, this.ecmr.ecmrId);
        }
        return null;
    }

    private shareByGroup() {
        if (this.groupFormControl.valid && this.groupFormControl.value && this.currentRole && this.ecmr?.ecmrId) {
            if (this.isExternalUser) { // not implemented
                return null;
            }

            const selectedGroupOption = this.getSelectedGroupOption();
            let groupId: number;

            if (selectedGroupOption) {
                const anotherGroupWithThesSameNameAndDescription = this.groupList.find(group => group.name === selectedGroupOption.name
                    && group.id !== selectedGroupOption.id && group.description === selectedGroupOption.description);
                if (anotherGroupWithThesSameNameAndDescription) {
                    this.snackBarService.openErrorSnackbar('share_ecmr_dialog.group_ambigous');
                    return null;
                }
                groupId = selectedGroupOption.id;
            } else { // no group selected, only group name entered
                const matchingGroups = this.groupList.filter(group => group.name === this.groupFormControl.value);
                if (matchingGroups.length === 1) {
                    groupId = matchingGroups[0].id;
                } else if (matchingGroups.length > 1) {
                    this.snackBarService.openInfoSnackbar('share_ecmr_dialog.select_one_group');
                    return null;
                } else {
                    this.snackBarService.openErrorSnackbar('share_ecmr_dialog.no_group_found');
                    return null;
                }
            }

            const ecmrShareWithGroup: EcmrShareWithGroup = {
                role: this.currentRole,
                groupId: groupId
            };
            return this.ecmrService.shareEcmrWithGroup(ecmrShareWithGroup, this.ecmr.ecmrId);
        } else {
            return null;
        }
    }

    changeRole(role: EcmrRole) {
        this.currentRole = role
        if (this.ecmr.ecmrId) {
            (this.isExternalUser ? this.externalUserService.getShareToken(this.ecmr.ecmrId, role, this.userToken, this.tan) : this.ecmrService.getShareToken(this.ecmr.ecmrId, role)).subscribe(token => {
                this.ecmrToken = token;
                this.shareString = this.currentRole !== EcmrRole.Reader ?
                    `${this.externalUserShareString}/${this.ecmr.ecmrId}?token=${this.ecmrToken}&role=${this.currentRole}` :
                    `${this.readerShareString}/${this.ecmr.ecmrId}/share-pdf?shareToken=${this.ecmrToken}`
            })
        }
    }

    copyLink() {
        if (this.shareString) {
            navigator.clipboard.writeText(this.shareString);
            this.snackBarService.openSuccessSnackbar('share_ecmr_dialog.link_copied')
        }
    }

    closeDialog() {
        this.dialogRef.close()
    }

    selectSearchMode(mode: SearchMode): void {
        this.selectedSearch = this.searchOptionsMap[mode];
    }
}
