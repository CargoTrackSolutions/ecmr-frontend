/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
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
import { EcmrUser } from '../../../core/models/EcmrUser';
import { UserService } from '../../services/user.service';
import { MatIcon } from '@angular/material/icon';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TemplateUser } from '../../../core/models/TemplateUser';
import { TemplateOverviewService } from '../../../features/template-overview/template-overview-service/template-overview.service';

@Component({
    selector: 'app-share-template-dialog',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatTable,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatRow,
        MatRowDef,
        MatSortHeader,
        TranslateModule,
        MatHeaderCellDef,
        MatSortModule,
        MatCheckbox,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix
    ],
    templateUrl: './share-template-dialog.component.html',
    styleUrl: './share-template-dialog.component.scss'
})
export class ShareTemplateDialogComponent {
    dialogRef = inject<MatDialogRef<ShareTemplateDialogComponent>>(MatDialogRef);
    private userService = inject(UserService);
    private templateService = inject(TemplateOverviewService);
    data = inject<{
        template: TemplateUser;
    }>(MAT_DIALOG_DATA);


    dataSource: MatTableDataSource<EcmrUser> = new MatTableDataSource<EcmrUser>();
    displayedColumns: string[] = ['select', 'firstName', 'lastName', 'email'];
    selection = new SelectionModel<EcmrUser>(true, []);

    @ViewChild(MatSort) sort: MatSort = new MatSort();

    templateUserToShare: TemplateUser;

    constructor() {
        this.templateUserToShare = this.data.template;
        this.userService.getAllUsers().subscribe(users => {
            this.dataSource.data = users;
            this.dataSource.sort = this.sort;
        })

    }

    applyFilter($event: KeyboardEvent) {
        const filterValue = ($event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    close() {
        this.dialogRef.close()
    }

    shareTemplate() {
        if (this.templateUserToShare && !this.selection.isEmpty()) {
            const ids: number[] = [];
            this.selection.selected.forEach(user => {
                if (user.id) {
                    ids.push(user.id);
                }
            })
            this.templateService.shareTemplate(this.templateUserToShare.id, ids).subscribe(res => {
                if (res) {
                    this.dialogRef.close(res)
                }
            })
        }
    }
}
