/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprovedUrlService } from '../../../shared/services/approved-url.service';
import { ApprovedUrlCreate } from '../../../core/models/Approved-Url/ApprovedUrlCreate';
import { ApprovedUrl } from '../../../core/models/Approved-Url/ApprovedUrl';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-approve-url-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatIcon,
        MatFormField,
        MatInput,
        MatLabel,
        MatPrefix,
        MatSlideToggle,
        ReactiveFormsModule,
        MatError,
        TranslatePipe
    ],
    templateUrl: './approve-url-dialog.component.html',
    styleUrl: './approve-url-dialog.component.scss'
})
export class ApproveUrlDialogComponent implements OnInit {

    private readonly dialogRef: MatDialogRef<ApproveUrlDialogComponent> = inject(MatDialogRef);
    protected readonly data: ApprovedUrl | undefined = inject(MAT_DIALOG_DATA);
    private readonly snackBarService: SnackbarService = inject(SnackbarService);

    private readonly approvedUrlService: ApprovedUrlService = inject(ApprovedUrlService)

    protected form = new FormGroup({
        url: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
        approvedState: new FormControl<boolean>(false, {nonNullable: true, validators: [Validators.required]}),
    })

    ngOnInit() {
        if (this.data) this.form.patchValue(this.data);
    }

    protected saveApprovedUrl(): void {
        if (this.form.valid) {
            const urlValue = this.form.controls.url.value;
            const createUpdateModel: ApprovedUrlCreate = {
                url: urlValue.endsWith('/') ? urlValue.slice(0, -1) : urlValue,
                approvedState: this.form.controls.approvedState.value,
            }

            if (this.data == undefined) {
                this.approvedUrlService.createApprovedUrl(createUpdateModel).subscribe(result => {
                    this.snackBarService.openSuccessSnackbarWithDuration('SAVE.SUCCESS', 3000)
                    this.closeDialog(result);
                })
            } else {
                this.approvedUrlService.updateApprovedUrl(createUpdateModel, this.data.id).subscribe(result => {
                    this.snackBarService.openSuccessSnackbarWithDuration('UPDATE.SUCCESS', 3000)
                    this.closeDialog(result);
                })
            }
        }
    }

    protected closeDialog(approvalResult: ApprovedUrl | null = null): void {
        this.dialogRef.close(approvalResult);
    }
}