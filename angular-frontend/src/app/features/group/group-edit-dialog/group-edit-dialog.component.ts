/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Group } from '../../../core/models/Group';
import { GroupService } from '../group.service';
import { GroupCreation } from '../../../core/models/GroupCreation';
import { GroupUpdate } from '../../../core/models/GroupUpdate';
import { catchError, filter, of } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-group-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatDialogActions,
        MatFormField,
        TranslateModule,
        MatInput,
        ReactiveFormsModule,
        MatSelect,
        MatLabel,
        MatIcon,
        MatOption,
        MatError,
        NgClass
    ],
    templateUrl: './group-edit-dialog.component.html',
    styleUrl: './group-edit-dialog.component.scss'
})
export class GroupEditDialogComponent {

    groupFormGroup = new FormGroup({
        name: new FormControl<string>('', [Validators.required]),
        description: new FormControl<string | null>(''),
        parentId: new FormControl<Group | null>(null),
    });

    groups: Group[] = [];

    currentGroup: Group;
    isEditMode: boolean = false;

    constructor(public dialogRef: MatDialogRef<GroupEditDialogComponent>,
                private groupService: GroupService,
                @Inject(MAT_DIALOG_DATA) public data: { parentGroup: Group, groupToEdit: Group }) {
        if (data.groupToEdit) {
            this.currentGroup = data.groupToEdit;
            this.groupFormGroup.patchValue(data.groupToEdit);
            this.isEditMode = true;
        }
        this.groupService.getAllGroups(true).subscribe(groups => {
            if (data.parentGroup) {
                this.groups = this.findGroup(groups, data.parentGroup)
            } else {
                this.groups = groups
            }
        })
        if (data.parentGroup) {
            this.groupFormGroup.controls.parentId.setValue(data.parentGroup);
            this.groupFormGroup.controls.parentId.disable();
        }
    }

    findGroup(groups: Group[], parentGroup: Group): Group[] {
        for (const child of groups) {
            if (child.id === parentGroup.id) {
                return groups;
            } else {
                const found = this.findGroup(child.children, parentGroup);
                if (found.length > 0) {
                    return found;
                }
            }
        }
        return [];
    }

    compareGroupFn(c1: Group, c2: Group): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    saveGroup() {
        if (this.groupFormGroup.valid) {
            if (this.isEditMode && this.currentGroup?.id) {
                const groupUpdate: GroupUpdate = {
                    name: this.groupFormGroup.controls.name.value!,
                    description: this.groupFormGroup.controls.description.value!,
                }
                this.groupService.updateGroup(groupUpdate, this.currentGroup.id).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err);
                        return of(null)
                    })
                ).subscribe(res => {
                    if (res) this.dialogRef.close(res)
                })
            } else {
                let parentId: number | null | undefined = null;
                if (this.groupFormGroup.controls.parentId.getRawValue()) {
                    parentId = this.groupFormGroup.controls.parentId.getRawValue()?.id
                }
                const group: GroupCreation = {
                    name: this.groupFormGroup.controls.name.value!,
                    description: this.groupFormGroup.controls.description.value,
                    parentId: parentId
                }
                this.groupService.createGroup(group).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err);
                        return of(null)
                    })
                ).subscribe(res => {
                    if (res) this.dialogRef.close(res)
                })
            }
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
