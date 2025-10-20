/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';

export interface ConfirmationDialogData {
  text: string;
  checkBoxText?: string;
  textParams?: {[key: string]: any};
}

export interface ConfirmationDialogResult {
  isConfirmed: boolean;
  isCheckboxTicked: boolean;
  }

@Component({
    selector: 'app-confirmation-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatButton,
        TranslateModule,
        MatDialogTitle,
        MatCheckbox,
        MatIcon
    ],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
    data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
    dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);


  dialogResult: ConfirmationDialogResult = {
    isConfirmed: false,
    isCheckboxTicked: false
  };

  toggleCreateCopy() {
    this.dialogResult.isCheckboxTicked = !this.dialogResult.isCheckboxTicked;
  }

  close(isConfirmed: boolean){
    this.dialogResult.isConfirmed = isConfirmed;
    this.dialogRef.close(this.dialogResult);
  }
}
