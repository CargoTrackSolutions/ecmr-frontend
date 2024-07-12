/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-template-name-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatFormField,
        MatDialogActions,
        MatIcon,
        ReactiveFormsModule,
        MatButton,
        MatDialogTitle,
        MatInput,
        MatLabel,
        TranslateModule
    ],
    templateUrl: './template-name-dialog.component.html',
    styleUrl: './template-name-dialog.component.scss'
})
export class TemplateNameDialogComponent {

    templateNameDialogFormGroup = new FormGroup({
        templateName: new FormControl<string>('', Validators.required)
    });

    constructor(public dialogRef: MatDialogRef<TemplateNameDialogComponent>) {
    }

    saveTemplateName() {
        if (this.templateNameDialogFormGroup.valid) {
            this.dialogRef.close(this.templateNameDialogFormGroup.controls.templateName.value);
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
