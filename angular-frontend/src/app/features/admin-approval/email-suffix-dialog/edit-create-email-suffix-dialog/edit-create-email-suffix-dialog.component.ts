/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { MailSuffix } from '../../../../core/models/MailSuffix';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MailSuffixService } from '../../../../shared/services/mail-suffix.service';

@Component({
    selector: 'app-edit-create-email-suffix-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatFormField,
        ReactiveFormsModule,
        MatError,
        TranslatePipe,
        MatLabel,
        FormsModule,
        MatInput,
        MatButton,
        MatPrefix,
        MatIcon
    ],
    templateUrl: './edit-create-email-suffix-dialog.component.html',
    styleUrl: './edit-create-email-suffix-dialog.component.scss'
})
export class EditCreateEmailSuffixDialogComponent {

  protected readonly data: { mailSuffix: MailSuffix | null, urlId: number } = inject(MAT_DIALOG_DATA);
    protected readonly dialogRef: MatDialogRef<EditCreateEmailSuffixDialogComponent> = inject<MatDialogRef<EditCreateEmailSuffixDialogComponent>>(MatDialogRef);

    private readonly mailSuffixService: MailSuffixService = inject(MailSuffixService);

    mailSuffix: FormControl<string | null> = new FormControl<string | null>(this.data.mailSuffix?.mailSuffix ?? null, [Validators.required]);

    saveEmailSuffix(): void {
        if (this.mailSuffix.value) {
            if (this.data.mailSuffix) {
                this.mailSuffixService.updateMailSuffix(this.mailSuffix.value, this.data.mailSuffix.id).subscribe(res => this.dialogRef.close(res));
            } else {
                this.mailSuffixService.createMailSuffix(this.mailSuffix.value, this.data.urlId).subscribe(res => this.dialogRef.close(res))
            }
        }
    }

}
