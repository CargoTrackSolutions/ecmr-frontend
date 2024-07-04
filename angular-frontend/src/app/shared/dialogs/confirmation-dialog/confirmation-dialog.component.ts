/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

export interface ConfirmationDialogData {
  text: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslateModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData, public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  close(result: boolean){
    this.dialogRef.close(result);
  }

}
