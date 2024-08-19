/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { EcmrService } from '../../services/ecmr.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { EcmrUser } from '../../../core/models/EcmrUser';
import { UserService } from '../../services/user.service';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { catchError, filter, map, of, startWith } from 'rxjs';
import { EcmrShare } from '../../../core/models/EcmrShare';
import { environment } from '../../../../environments/environment';
import { ShareEcmrResult } from '../../../core/enums/ShareEcmrResult';

@Component({
    selector: 'app-share-ecmr-dialog',
    standalone: true,
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
        QRCodeModule,
        MatIcon,
        MatDivider,
        MatIconButton,
        NgIf,
        AsyncPipe,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
    ],
    templateUrl: './share-ecmr-dialog.component.html',
    styleUrl: './share-ecmr-dialog.component.scss'
})
export class ShareEcmrDialogComponent implements OnInit {

    emailFormControl = new FormControl<string>('', Validators.required)
    protected readonly EcmrRole = EcmrRole;

    @ViewChild('qrcodeElement', {static: true}) qrcodeElement: QRCodeComponent;

    ecmr: Ecmr;
    ecmrToken: string;

    userList: EcmrUser[] = [];
    filteredUserList: EcmrUser[] = [];

    carrierShareString = `${environment.frontendUrl}/carrier-registration`;
    shareString = '';
    currentRole: EcmrRole = EcmrRole.Sender;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Ecmr,
        public dialogRef: MatDialogRef<ShareEcmrDialogComponent>,
        private snackBarService: SnackbarService,
        private ecmrService: EcmrService,
        private userService: UserService
    ) {
        if (data) {
            this.ecmr = data
            if (this.ecmr.ecmrId) this.ecmrService.getShareToken(this.ecmr.ecmrId, EcmrRole.Sender).subscribe(token => {
                this.ecmrToken = token;
                this.shareString = `${this.carrierShareString}/${this.ecmr.ecmrId}/${this.ecmrToken}`
            })

            this.userService.getAllUsers().subscribe(userResult => {
                this.userList = userResult;
            })
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
    }

    private _filter(value: string): EcmrUser[] {
        const filterValue = value.toLowerCase();

        return this.userList.filter(user =>
            user.email.toLowerCase().includes(filterValue)
        );
    }

    share() {
        if (this.emailFormControl.valid && this.emailFormControl.value && this.currentRole && this.ecmr?.ecmrId) {
            const ecmrShare: EcmrShare = {
                role: this.currentRole,
                email: this.emailFormControl.value
            }
            this.ecmrService.shareEcmr(ecmrShare, this.ecmr.ecmrId).pipe(
                catchError(err => {
                    console.error(err);
                    if (err.status === 501) {
                        this.snackBarService.openErrorSnackbar('error.not_implemented');
                    }
                    return of(null)
                }),
                filter(result => result?.result != null),
                map(result => result)
            ).subscribe(response => {
                if (response?.result) {
                    const shareResult: ShareEcmrResult = response.result;
                    switch (shareResult) {
                        case ShareEcmrResult.SharedExternal:
                            this.snackBarService.openSuccessSnackbar('share_ecmr_dialog.shared_external');
                            this.dialogRef.close()
                            break;
                        case ShareEcmrResult.SharedInternal:
                            this.snackBarService.openSuccessSnackbarWithTranslationValue('share_ecmr_dialog.shared_internal', response.group.name);
                            this.dialogRef.close()
                            break;
                        case ShareEcmrResult.ErrorInternalUserHasNoGroup:
                            this.snackBarService.openErrorSnackbar('share_ecmr_dialog.user_has_no_group');
                            break;
                    }
                }
            })
        }
    }

    copyQRCode(qrcodeElement: QRCodeComponent) {
        let base64Image: string | null = null;

        const canvas = qrcodeElement.qrcElement.nativeElement.querySelector('canvas');
        base64Image = canvas?.toDataURL('image/png') || null;
        if (base64Image) {
            this.copyToClipboard(base64Image);
        }
    }

    downloadQRCode(qrcodeElement: QRCodeComponent) {
        let base64Image: string | null = null;
        const canvas = qrcodeElement.qrcElement.nativeElement.querySelector('canvas');
        base64Image = canvas?.toDataURL('image/png') || null;
        if (base64Image) {
            this.downloadImage(base64Image, 'qrcode.png');
        } else {
            this.snackBarService.openErrorSnackbar('share_ecmr_dialog.no_qr_code_found');
        }
    }

    private copyToClipboard(base64Image: string) {
        fetch(base64Image)
            .then((res) => res.blob())
            .then((blob) => {
                const item = new ClipboardItem({'image/png': blob});
                navigator.clipboard.write([item]);
                this.snackBarService.openSuccessSnackbar('share_ecmr_dialog.qr_copied')
            })
            .catch((error) => this.snackBarService.openErrorSnackbar(error));
    }

    private downloadImage(base64Image: string, fileName: string) {
        const link = document.createElement('a');
        link.href = base64Image;
        link.download = fileName;
        link.click();
    }

    changeRole(role: EcmrRole) {
        this.currentRole = role
        if (this.ecmr.ecmrId) this.ecmrService.getShareToken(this.ecmr.ecmrId, role).subscribe(token => {
            this.ecmrToken = token;
            this.shareString = `${this.carrierShareString}/${this.ecmr.ecmrId}/${this.ecmrToken}`
        })
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
}
