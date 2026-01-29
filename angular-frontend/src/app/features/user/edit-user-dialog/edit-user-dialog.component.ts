/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { CountryCode } from '../../../core/enums/CountryCode';
import { GroupService } from '../../group/group.service';
import { catchError, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Group } from '../../../core/models/Group';
import { UserRole } from '../../../core/enums/UserRole';
import { EcmrUser } from '../../../core/models/EcmrUser';
import { UserService } from '../../../shared/services/user.service';
import { UserCreationAndUpdate } from '../../../core/models/UserCreationAndUpdate';
import { LoadingService } from '../../../core/services/loading.service';
import {
    MatTree,
    MatTreeFlatDataSource,
    MatTreeFlattener,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FlatGroupNode } from '../../../core/models/FlatGroupNode';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { AuthService } from '../../../core/services/auth.service';
import { PhoneValidatorService } from '../../../shared/services/phone-format.service';
import { CapabilitiesService } from '../../../core/services/capabilities-service';
import { MatCheckbox } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatChip } from '@angular/material/chips';

@Component({
    selector: 'app-edit-user-dialog',
    imports: [
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatLabel,
        MatIcon,
        MatSelect,
        MatOption,
        MatAutocomplete,
        MatAutocompleteTrigger,
        TranslateModule,
        AsyncPipe,
        NgClass,
        MatIconButton,
        KeyValuePipe,
        MatError,
        MatTree,
        MatTreeNode,
        MatTreeNodeDef,
        MatTreeNodePadding,
        MatTreeNodeToggle,
        MatCheckbox,
        MatChip
    ],
    templateUrl: './edit-user-dialog.component.html',
    styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit {
    dialogRef = inject<MatDialogRef<EditUserDialogComponent>>(MatDialogRef);
    private groupService = inject(GroupService);
    private userService = inject(UserService);
    private snackbarService = inject(SnackbarService);
    private loadingService = inject(LoadingService);
    private capabilitiesService = inject(CapabilitiesService);
    private matDialog = inject(MatDialog)

    data = inject<EcmrUser>(MAT_DIALOG_DATA);


    filteredCountries: Observable<string[]>;
    countries = Object.keys(CountryCode);

    defaultGroupId: number | null = null;

    userFormGroup = new FormGroup({
        country: new FormControl<CountryCode | null>(null, Validators.required),
        firstName: new FormControl<string>('', Validators.required),
        lastName: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, emailValidator()]),
        phone: new FormControl<string>('', [PhoneValidatorService.phoneNumberValidator()]),
        companyName: new FormControl<string | null>(null, [Validators.maxLength(255)]),
        role: new FormControl<UserRole | null>(null, Validators.required),
    })

    mfaStatusFormControl = new FormControl<boolean>(false);
    mfaEnabled = false;

    capabilities = this.capabilitiesService.capabilities();

    private _transformer = (node: Group, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            description: node.description,
            id: node.id,
            children: node.children,
            level: level
        };
    };

    treeControl = new FlatTreeControl<FlatGroupNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    hasChild = (_: number, node: FlatGroupNode) => node.expandable;

    user: EcmrUser;
    selectedGroups: Group[] = [];

    isEditMode: boolean = false;
    isAuthenticatedUser: boolean;

    constructor() {
        const authService = inject(AuthService);
        const data = this.data;

        if (data?.id) {
            this.user = data;
            this.isEditMode = true;
            this.defaultGroupId = this.user.defaultGroupId;
            this.initializeForm(data);
        }
        authService.getAuthenticatedUser().subscribe(authenticatedUser => {
            this.isAuthenticatedUser = this.user?.id === authenticatedUser?.user.id;
        })
    }

    initializeForm(user: EcmrUser) {
        this.userFormGroup.patchValue(user);
    }

    ngOnInit() {
        this.filteredCountries = this.userFormGroup.controls.country.valueChanges
            .pipe(
                startWith(this.userFormGroup.controls.country.value ?? ''),
                map(value => this._filter(value ?? ''))
            );

        this.loadingService.showLoaderUntilCompleted(this.groupService.getAllGroups(true)).subscribe(groups => {
            this.dataSource.data = groups;
        })

        if (this.isEditMode && this.user?.id) {
            this.loadingService.showLoaderUntilCompleted(this.userService.getGroupsForUser(this.user.id)).subscribe(groups => {
                this.selectedGroups = groups;
            })

            if(this.capabilities.externalUserManagement.getExternalUserMfaStatus && this.user.externalAccount) {
                this.userService.getMfaStatus(this.user.email).subscribe(mfaStatus => {
                    this.mfaStatusFormControl.setValue(mfaStatus);
                    this.mfaEnabled = mfaStatus;
                })
            }
        }
    }


    /**
     * Filter function for country autocomplete fields
     */
    private _filter(value: string): string[] {
        if (value) {
            const filteredValue: string = value.toUpperCase();
            return this.countries.filter(option =>
                option.includes(filteredValue)
            );
        } else {
            return []
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    protected readonly UserRole = UserRole;

    selectGroup(node: FlatGroupNode) {
        this.selectedGroups.push(node);
    }

    isSelected(node: FlatGroupNode) {
        return this.selectedGroups.some(group => group.id === node.id)
    }

    removeItem(group: Group) {
        const index = this.selectedGroups.findIndex(gro => gro.id === group.id);
        this.selectedGroups.splice(index, 1);
    }

    saveUser() {
        this.userFormGroup.markAllAsTouched();
        if (this.userFormGroup.valid && this.defaultGroupId) {
            const groupIds: number[] = [];
            this.selectedGroups.forEach(group => {
                if (group.id) groupIds.push(group.id);
            })

            const user: UserCreationAndUpdate = {
                firstName: this.userFormGroup.controls.firstName.value!,
                lastName: this.userFormGroup.controls.lastName.value!,
                email: this.userFormGroup.controls.email.value!,
                phone: this.userFormGroup.controls.phone.value,
                companyName: this.userFormGroup.controls.companyName.value,
                role: this.userFormGroup.controls.role.value!,
                country: this.userFormGroup.controls.country.value!,
                groupIds: groupIds,
                defaultGroupId: this.defaultGroupId
            }

            if (this.isEditMode && this.user?.id) {
                this.userService.updateUser(user, this.user.id).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err);
                        this.snackbarService.openErrorSnackbar("edit_user_dialog.error_saving");
                        return of(null);
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result);
                        this.snackbarService.openSuccessSnackbar("edit_user_dialog.successfully_saved");
                    }
                });
            } else {
                this.userService.createUser(user).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        if (err.status === 409) {
                            this.snackbarService.openErrorSnackbarWithTranslationValue('edit_user_dialog.already_exists', user.email);
                        } else {
                            this.snackbarService.openErrorSnackbar('edit_user_dialog.error_saving');
                        }
                        console.warn(err);
                        return of(null);
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result);
                        this.snackbarService.openSuccessSnackbar("edit_user_dialog.successfully_created");
                    }
                });
            }
        } else if (this.defaultGroupId == null) {
            this.snackbarService.openErrorSnackbar('error.default_group_required')
        }
    }

    setDefaultGroupId(id: number | null) {
        this.defaultGroupId = id;
    }

    resetPassword() {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'user_management.reset_password_confirmation',
            }
        }).afterClosed().pipe(
            filter(result => result.isConfirmed === true),
            switchMap(() => this.userService.resetPassword(this.user.email))
        ).subscribe({
            next: () => {
                this.snackbarService.openSuccessSnackbar('user_management.password_reset_successfully');
            },
            error: () => {
                this.snackbarService.openErrorSnackbar('user_management.error_resetting_password');
            }
        })

    }

    changeMfa() {
        const newMfaStatus = this.mfaStatusFormControl.value!;
        this.userService.changeMfa(this.user.email, newMfaStatus).subscribe();
    }
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valid = emailRegex.test(control.value);
        return valid ? null : {invalidEmail: true};
    };
}
