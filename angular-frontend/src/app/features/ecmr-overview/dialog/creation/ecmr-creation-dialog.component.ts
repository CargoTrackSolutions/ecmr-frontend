/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

interface DialogData {
}

/**
 * @license
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */
@Component({
  selector: 'app-ecmr-creation-dialog.component',
  templateUrl: 'ecmr-creation-dialog.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatButton, MatDialogActions, MatDialogClose],
})
export class EcmrCreationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
