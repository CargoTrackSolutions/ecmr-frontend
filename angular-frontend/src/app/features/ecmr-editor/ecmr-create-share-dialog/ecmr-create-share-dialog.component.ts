/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { GroupFlat } from '../../../core/models/GroupFlat';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-ecmr-create-share-dialog',
    imports: [
        MatDialogTitle,
        TranslateModule,
        MatDialogContent,
        MatButton,
        MatDialogActions,
        MatCheckbox
    ],
    templateUrl: './ecmr-create-share-dialog.component.html',
    styleUrl: './ecmr-create-share-dialog.component.scss'
})
export class EcmrCreateShareDialogComponent {
    private dialogRef = inject<MatDialogRef<EcmrCreateShareDialogComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);


    selectableGroups: GroupFlat[];
    selectedGroups: GroupFlat[] = [];

    constructor() {
        const data = this.data;

        if (data) this.selectableGroups = data;
    }

    closeDialog() {
        this.dialogRef.close()
    }


    addGroup(group: GroupFlat) {
        this.selectedGroups.push(group);
    }

    removeGroup(group: GroupFlat) {
        const index = this.selectedGroups.indexOf(group);
        this.selectedGroups.splice(index, 1);
    }

    checkboxChange($event: MatCheckboxChange, group: GroupFlat) {
        if ($event.checked) {
            this.addGroup(group);
        } else {
            this.removeGroup(group);
        }
    }

    selectGroup() {
        if (this.selectedGroups.length > 0) {
            this.dialogRef.close(this.selectedGroups)
        }
    }
}
