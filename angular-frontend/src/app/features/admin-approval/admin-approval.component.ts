/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { InstanceTableComponent } from './instance-table/instance-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ApprovedUrl } from '../../core/models/Approved-Url/ApprovedUrl';
import { ApproveUrlDialogComponent } from './approve-url-dialog/approve-url-dialog.component';
import { ApprovedUrlService } from '../../shared/services/approved-url.service';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { EcmrImportService } from '../../shared/services/ecmr-import.service';
import { ExportImportApprovedUrl } from '../../core/models/Approved-Url/ExportImportApprovedUrl';
import { PendingInstance } from '../../core/models/Approved-Url/PendingInstance';
import { JsonImportExportService } from '../../shared/services/json-import-export.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
    selector: 'app-admin-approval',
    imports: [
        MatToolbar,
        MatButton,
        MatIcon,
        TranslatePipe,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        InstanceTableComponent,
    ],
    templateUrl: './admin-approval.component.html',
    styleUrl: './admin-approval.component.scss'
})
export class AdminApprovalComponent implements OnInit {

    private readonly matDialog: MatDialog = inject(MatDialog);
    private readonly approvedUrlService: ApprovedUrlService = inject(ApprovedUrlService);
    private readonly ecmrImportService: EcmrImportService = inject(EcmrImportService);
    private readonly jsonImportExportService: JsonImportExportService = inject(JsonImportExportService);
    private readonly snackbarService: SnackbarService = inject(SnackbarService)

    approvedUrls: WritableSignal<ApprovedUrl[]> = model([]);
    pendingEcmr: WritableSignal<PendingInstance[]> = signal([]);

    ngOnInit() {
        this.approvedUrlService.getApprovedUrls().subscribe(approvedUrls => this.approvedUrls.set(approvedUrls))

        this.ecmrImportService.getPendingInstances().subscribe(ecmrImports => this.pendingEcmr.set(ecmrImports))
    }

    protected openEditCreateDialog(approvedUrlModel: ApprovedUrl | undefined = undefined): void {
        this.matDialog.open(ApproveUrlDialogComponent, {
            data: approvedUrlModel,
            minWidth: '400px',
            width: '50vw'
        }).afterClosed().pipe(
            filter((v): v is ApprovedUrl => v != null)
        ).subscribe((approvedUrl: ApprovedUrl) => {
            this.approvedUrls.update(list => [...list, approvedUrl]);
        })
    }

    exportUrls() {
        const exportUrls: ExportImportApprovedUrl[] = []
        this.approvedUrls().forEach((approvedUrl: ApprovedUrl) => {
            exportUrls.push({
                url: approvedUrl.url,
                approvedState: approvedUrl.approvedState,
            })
        })
        this.jsonImportExportService.exportAsJson(exportUrls, 'url_export.json')
    }

    protected approveUrl(pendingInstance: PendingInstance) {
        this.ecmrImportService.handleApprovalOfPendingEcmr(pendingInstance, true).pipe(
            switchMap(() => this.ecmrImportService.getPendingInstances()),
            tap(res => this.pendingEcmr.set(res)),
            switchMap(() => this.approvedUrlService.getApprovedUrls())
        ).subscribe(approvedUrls => this.approvedUrls.set(approvedUrls));
    }

    protected rejectUrl(pendingInstance: PendingInstance) {
        this.ecmrImportService.handleApprovalOfPendingEcmr(pendingInstance, false).pipe(
            switchMap(() => this.ecmrImportService.getPendingInstances()),
            tap(res => this.pendingEcmr.set(res)),
            switchMap(() => this.approvedUrlService.getApprovedUrls())
        ).subscribe(approvedUrls => this.approvedUrls.set(approvedUrls));
    }

    openFileDialog(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        try {
            const json: ExportImportApprovedUrl[] = await this.jsonImportExportService.importJson(file);
            this.approvedUrlService.createMultipleApprovedUrls(json).pipe(
                catchError(() => {
                    this.snackbarService.openErrorSnackbarWithDuration('url_approval.import_error', 3000)
                    return of(null)
                }),
                tap(res => {
                    if (res) {
                        this.snackbarService.openSuccessSnackbarWithDuration('url_approval.import_success', 3000)
                        this.approvedUrls.update(curr => [...curr, ...res])
                    }
                }),
                switchMap(() => this.ecmrImportService.getPendingInstances())
            ).subscribe(res => {
                this.pendingEcmr.set(res);
            });
        } catch (err) {
            console.error(err);
            this.snackbarService.openErrorSnackbarWithDuration('url_approval.import_error', 3000)
        } finally {
            input.value = '';
        }
    }
}
