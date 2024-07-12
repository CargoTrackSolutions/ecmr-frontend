/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
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
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-load-from-template-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatTable,
        MatSort,
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
        MatNoDataRow,
        MatHeaderRowDef,
        MatRowDef,
        TranslateModule,
        NgIf,
        MatDialogTitle
    ],
    templateUrl: './load-from-template-dialog.component.html',
    styleUrl: './load-from-template-dialog.component.scss'
})
export class LoadFromTemplateDialogComponent implements OnInit {
    dataSource: MatTableDataSource<TemplateUser> = new MatTableDataSource<TemplateUser>();
    columnsToDisplay: string[] = ['number', 'name', 'refId', 'from', 'to'];
    
    selectedTemplate: TemplateUser;

    constructor(public dialogRef: MatDialogRef<LoadFromTemplateDialogComponent>, public overviewService: TemplateOverviewService) {
    }

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
