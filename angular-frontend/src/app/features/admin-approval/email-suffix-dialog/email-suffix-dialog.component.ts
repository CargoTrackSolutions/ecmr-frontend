/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ApprovedUrl } from '../../../core/models/Approved-Url/ApprovedUrl';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MailSuffixService } from '../../../shared/services/mail-suffix.service';
import { ExportImportMailSuffix, MailSuffix } from '../../../core/models/MailSuffix';
import { MatToolbar } from '@angular/material/toolbar';
import { JsonImportExportService } from '../../../shared/services/json-import-export.service';
import { filter, of, switchMap, tap } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { EditCreateEmailSuffixDialogComponent } from './edit-create-email-suffix-dialog/edit-create-email-suffix-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-email-suffix-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatIcon,
        MatToolbar,
        MatIconButton,
        TranslatePipe
    ],
    templateUrl: './email-suffix-dialog.component.html',
    styleUrl: './email-suffix-dialog.component.scss'
})
export class EmailSuffixDialogComponent implements OnInit {

    protected readonly dialogRef: MatDialogRef<EmailSuffixDialogComponent> = inject<MatDialogRef<EmailSuffixDialogComponent>>(MatDialogRef);
    protected readonly data: ApprovedUrl = inject(MAT_DIALOG_DATA);

    private readonly mailSuffixService: MailSuffixService = inject(MailSuffixService);
    private readonly jsonImportExportService: JsonImportExportService = inject(JsonImportExportService);
    private readonly matDialog: MatDialog = inject(MatDialog);
    private readonly snackBarService: SnackbarService = inject(SnackbarService);

    protected readonly mailSuffixes: WritableSignal<MailSuffix[]> = signal<MailSuffix[]>([]);

    ngOnInit(): void {
        this.mailSuffixService.getMailSuffixForApprovedUrl(this.data).subscribe((mailSuffix: MailSuffix[]): void => this.mailSuffixes.set(mailSuffix));
    }

    createEmailSuffix(): void {
        this.matDialog.open(EditCreateEmailSuffixDialogComponent, {
            data: {mailSuffix: null, urlId: this.data.id},
            disableClose: true,
            autoFocus: 'dialog',
            width: '70vw',
            maxWidth: '500px'
        }).afterClosed().pipe(
            filter(res => res != null),
        ).subscribe(res => this.mailSuffixes.update(list => [...list, res]));
    }

    editEmailSuffix(mailSuffix: MailSuffix): void {
        this.matDialog.open(EditCreateEmailSuffixDialogComponent, {
            data: {mailSuffix: mailSuffix, urlId: this.data.id},
            disableClose: true,
            autoFocus: 'dialog',
            width: '70vw',
            maxWidth: '500px'
        }).afterClosed().pipe(
            filter(res => res != null),
        ).subscribe(res => {
            this.mailSuffixes.update(list => {
                const i = list.findIndex(suffix => suffix.id === mailSuffix.id);
                if (i === -1) return list;
                const copy = [...list];
                copy[i] = {...copy[i], ...res};
                return copy;
            });
        })
    }

    openFileDialog(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    exportUrls() {
        const exportSuffixes: ExportImportMailSuffix[] = []
        this.mailSuffixes().forEach((mailSuffix: MailSuffix) => {
            exportSuffixes.push({
                mailSuffix: mailSuffix.mailSuffix,
            })
        })
        this.jsonImportExportService.exportAsJson(exportSuffixes, 'suffix_export.json')
    }

    async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        try {
            const json: MailSuffix[] = await this.jsonImportExportService.importJson(file);
            this.mailSuffixService.importMailSuffix(json, this.data.id).pipe(
                tap(res => {
                    this.mailSuffixes.update(curr => [...curr, ...res])
                    this.snackBarService.openSuccessSnackbarWithDuration('email_suffix.import_success', 3000)
                }),
            ).subscribe();
        } catch (err) {
            console.error(err);
            this.snackBarService.openErrorSnackbarWithDuration('email_suffix.import_error', 3000)
        } finally {
            input.value = '';
        }
    }

    protected deleteMailSuffix(mailSuffix: MailSuffix) {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'email_suffix.delete_message'
            }
        }).afterClosed().pipe(
            filter(res => res.isConfirmed),
            switchMap(() => this.mailSuffixService.deleteMailSuffix(mailSuffix)),
            filter(res => res),
            switchMap(() => {
                return of(this.mailSuffixes().filter(suffix => suffix.id != mailSuffix.id));
            })
        ).subscribe(result => {
            this.snackBarService.openSuccessSnackbarWithDuration('email_suffix.delete_success', 3000)
            this.mailSuffixes.set(result);
        })
    }
}
