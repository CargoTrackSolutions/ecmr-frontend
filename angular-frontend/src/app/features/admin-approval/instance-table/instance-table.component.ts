/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import { Component, effect, inject, model, ModelSignal, OnInit, viewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApprovedUrlService } from '../../../shared/services/approved-url.service';
import { ApprovedUrl } from '../../../core/models/Approved-Url/ApprovedUrl';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ApproveUrlDialogComponent } from '../approve-url-dialog/approve-url-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DatePipe } from '@angular/common';
import { filter, of, switchMap } from 'rxjs';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { EmailSuffixDialogComponent } from '../email-suffix-dialog/email-suffix-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-instance-table',
    imports: [
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        MatHeaderCellDef,
        MatPaginator,
        MatIconButton,
        MatIcon,
        MatSlideToggle,
        DatePipe,
        TranslatePipe
    ],
    templateUrl: './instance-table.component.html',
    styleUrl: './instance-table.component.scss'
})
export class InstanceTableComponent implements OnInit {

    private readonly approvedUrlService: ApprovedUrlService = inject(ApprovedUrlService);
    private readonly snackBarService: SnackbarService = inject(SnackbarService);
    private readonly matDialog: MatDialog = inject(MatDialog);

    approvedUrls: ModelSignal<ApprovedUrl[]> = model([] as ApprovedUrl[]);

    paginator = viewChild<MatPaginator>(MatPaginator);

    dataSource = new MatTableDataSource<ApprovedUrl>([]);

    displayedColumns: string[] = ['url', 'approved', 'createdAt', 'updatedAt', 'updatedBy', 'actions']

    constructor() {
        effect(() => {
            this.dataSource.data = this.approvedUrls();
        });
    }

    ngOnInit() {
        this.dataSource.data = this.approvedUrls();
        this.dataSource.paginator = this.paginator()
    }

    protected deleteApprovedUrl(approvedUrl: ApprovedUrl) {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'url_approval.delete_message'
            },
            autoFocus: 'dialog'
        }).afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(() => this.approvedUrlService.deleteApprovedUrl(approvedUrl.id)),
            filter(result => result),
            switchMap(() => {
                return of(this.approvedUrls().filter(url => url.id != approvedUrl.id));
            })
        ).subscribe(result => {
            this.snackBarService.openSuccessSnackbarWithDuration('url_approval.delete_success', 3000)
            this.approvedUrls.set(result);
        })
    }

    protected toggleApprovedUrl(approvedUrl: ApprovedUrl, $event: MatSlideToggleChange): void {
        const approvedUrlUpdate = {
            url: approvedUrl.url,
            approvedState: $event.checked,
        };
        this.approvedUrlService.updateApprovedUrl(approvedUrlUpdate, approvedUrl.id).subscribe(() => {
            this.snackBarService.openSuccessSnackbarWithDuration('url_approval.approval_change', 4000)
        })
    }

    protected editApprovedUrl(approvedUrl: ApprovedUrl) {
        this.matDialog.open(ApproveUrlDialogComponent, {
            data: approvedUrl,
            minWidth: '400px',
            width: '50vw'
        }).afterClosed().pipe(
            filter(res => res),
            switchMap(() => this.approvedUrlService.getApprovedUrls())
        ).subscribe(res => {
            this.approvedUrls.set(res)
        })
    }

    protected openMailSuffixDialog(approvedUrl: ApprovedUrl) {
        this.matDialog.open(EmailSuffixDialogComponent, {
            data: approvedUrl,
            maxWidth: '900px',
            width: '80vw',
            autoFocus: 'dialog'
        })
    }
}