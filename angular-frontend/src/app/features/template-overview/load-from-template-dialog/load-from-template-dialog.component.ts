/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
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
import { MatIcon } from '@angular/material/icon';
import { TemplateUser } from '../../../core/models/TemplateUser';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { TemplateOverviewService } from '../template-overview-service/template-overview.service';

@Component({
    selector: 'app-load-from-template-dialog',
    imports: [
        MatDialogContent,
        MatTable,
        MatColumnDef,
        MatDialogActions,
        MatIcon,
        MatRow,
        MatHeaderRow,
        MatHeaderCell,
        MatCell,
        MatButton,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRowDef,
        MatRowDef,
        TranslateModule,
        MatDialogTitle
    ],
    templateUrl: './load-from-template-dialog.component.html',
    styleUrl: './load-from-template-dialog.component.scss'
})
export class LoadFromTemplateDialogComponent implements OnInit {
    dialogRef = inject<MatDialogRef<LoadFromTemplateDialogComponent>>(MatDialogRef);
    overviewService = inject(TemplateOverviewService);

    dataSource: MatTableDataSource<TemplateUser> = new MatTableDataSource<TemplateUser>();
    columnsToDisplay: string[] = ['number', 'name', 'refId', 'from', 'to'];
    
    selectedTemplate: TemplateUser;

    ngOnInit(): void {
        this.overviewService.getAllTemplates().subscribe(data => {
            this.dataSource.data = data;
        })
    }

    closeDialog() {
        this.dialogRef.close();
    }

    loadSelectedTemplate() {
        this.dialogRef.close(this.selectedTemplate);
    }
}
