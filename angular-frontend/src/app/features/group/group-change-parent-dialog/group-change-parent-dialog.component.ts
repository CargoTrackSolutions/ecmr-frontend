/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { Group } from '../../../core/models/Group';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { GroupService } from '../group.service';
import { GroupParentUpdate } from '../../../core/models/GroupParentUpdate';

@Component({
    selector: 'app-group-change-parent-dialog',
    standalone: true,
    imports: [
        MatDialogTitle,
        TranslateModule,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatFormField,
        MatError,
        MatLabel,
        MatOption,
        MatSelect,
        ReactiveFormsModule
    ],
    templateUrl: './group-change-parent-dialog.component.html',
    styleUrl: './group-change-parent-dialog.component.scss'
})
export class GroupChangeParentDialogComponent {

    parentId = new FormControl<Group | null>(null)
    groups: Group[];
    groupToEdit: Group;

    constructor(private dialogRef: MatDialogRef<GroupChangeParentDialogComponent>,
                private groupService: GroupService,
                @Inject(MAT_DIALOG_DATA) public data: Group) {
        this.groupToEdit = data

        this.groupService.getAllGroups(true).subscribe(groups => {
            this.groups = this.getAllGroups(groups, this.groupToEdit);
        })
    }

    getAllGroups(groups: Group[], groupToEdit: Group): Group[] {
        const allGroups: Group[] = [];

        function addGroupAndChildren(group: Group) {
            if (groupToEdit && group.id === groupToEdit.id) {
                return;
            }
            allGroups.push(group);
            if (group.children && group.children.length > 0) {
                group.children.forEach(child => addGroupAndChildren(child));
            }
        }

        groups.forEach(group => addGroupAndChildren(group));
        return allGroups;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    compareGroupFn(c1: Group, c2: Group): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    saveGroup() {
        if (this.parentId.valid) {
            const id = this.parentId.value ? this.parentId.value.id : null;
            const groupParentUpdate: GroupParentUpdate = {
                parentId: id
            }
            this.groupService.updateGroupParent(groupParentUpdate, this.groupToEdit.id).subscribe(group => {
                this.dialogRef.close(group);
            })
        }
    }
}
