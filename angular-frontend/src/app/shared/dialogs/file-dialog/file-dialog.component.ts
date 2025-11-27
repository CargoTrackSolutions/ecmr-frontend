/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, effect, inject, Signal, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FileModel } from '../../../core/models/File.model';
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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-file-dialog',
    imports: [
        MatDialogContent,
        MatDialogActions,
        MatDialogTitle,
        MatButton,
        TranslatePipe,
        MatIcon,
        MatTable,
        MatSort,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatSortModule
    ],
    templateUrl: './file-dialog.component.html',
    styleUrl: './file-dialog.component.scss'
})
export class FileDialogComponent {

    private readonly data: FileModel[] = inject(MAT_DIALOG_DATA);
    protected readonly dialogRef: MatDialogRef<FileDialogComponent> = inject(MatDialogRef);

    protected readonly dataSource: MatTableDataSource<FileModel> = new MatTableDataSource<FileModel>(this.data);
    protected readonly matSort: Signal<MatSort> = viewChild.required<MatSort>(MatSort);

    displayedColumns: string[] = ['name', 'creationDate', 'type', 'size', 'actions'];

    constructor() {
        effect(() => {
            this.dataSource.sort = this.matSort();
        });
    }

}
