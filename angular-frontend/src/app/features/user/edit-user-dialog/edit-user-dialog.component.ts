/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDrawerContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDisableControlDirective } from '../../ecmr-editor/dynamic-disable-control.directive';
import { CountryCode } from '../../../core/enums/CountryCode';
import { GroupService } from '../../group/group.service';
import { catchError, filter, map, Observable, of, startWith } from 'rxjs';
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

@Component({
    selector: 'app-edit-user-dialog',
    standalone: true,
    imports: [
        MatDrawerContent,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatCard,
        MatCardContent,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        NgForOf,
        NgIf,
        MatLabel,
        MatIcon,
        MatSelect,
        MatOption,
        MatAutocomplete,
        MatAutocompleteTrigger,
        TranslateModule,
        DynamicDisableControlDirective,
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
        NgTemplateOutlet
    ],
    templateUrl: './edit-user-dialog.component.html',
    styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {

    filteredCountries: Observable<string[]>;
    countries = Object.keys(CountryCode);

    userFormGroup = new FormGroup({
        country: new FormControl<CountryCode | null>(null, Validators.required),
        firstName: new FormControl<string>('', Validators.required),
        lastName: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', Validators.required),
        phone: new FormControl<string>(''),
        role: new FormControl<UserRole | null>(null, Validators.required),
    })

    private _transformer = (node: Group, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            group: node,
            level: level,
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

    constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
                private groupService: GroupService,
                private userService: UserService,
                private loadingService: LoadingService,
                @Inject(MAT_DIALOG_DATA) public data: EcmrUser) {
        if (data?.id) {
            this.user = data;
            this.isEditMode = true;
            this.initializeForm(data);
        }
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
        this.selectedGroups.push(node.group);
    }

    isSelected(node: FlatGroupNode) {
        return this.selectedGroups.some(group => group.id === node.group.id)
    }

    removeItem(group: Group) {
        const index = this.selectedGroups.findIndex(gro => gro.id === group.id);
        this.selectedGroups.splice(index, 1);
    }

    saveUser() {
        this.userFormGroup.markAllAsTouched();
        if (this.userFormGroup.valid) {
            const groupIds: number[] = [];
            this.selectedGroups.forEach(group => {
                if (group.id) groupIds.push(group.id);
            })
            const user: UserCreationAndUpdate = {
                firstName: this.userFormGroup.controls.firstName.value!,
                lastName: this.userFormGroup.controls.lastName.value!,
                email: this.userFormGroup.controls.email.value!,
                phone: this.userFormGroup.controls.phone.value,
                role: this.userFormGroup.controls.role.value!,
                country: this.userFormGroup.controls.country.value!,
                groupIds: groupIds,
            }
            if (this.isEditMode && this.user?.id) {
                this.userService.updateUser(user, this.user.id).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err)
                        return of(null)
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result)
                    }
                });
            } else {
                this.userService.createUser(user).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err)
                        return of(null)
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result)
                    }
                });
            }
        }
    }
}
