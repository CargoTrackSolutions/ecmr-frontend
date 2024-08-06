/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
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
import { CdkColumnDef } from '@angular/cdk/table';
import { Group } from '../../../core/models/Group';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-group-overview',
    standalone: true,
    imports: [
        MatToolbar,
        MatButton,
        MatIcon,
        MatLabel,
        MatToolbarRow,
        TranslateModule,
        MatTable,
        CdkColumnDef,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatPaginator
    ],
    templateUrl: './group-overview.component.html',
    styleUrl: './group-overview.component.scss'
})
export class GroupOverviewComponent implements OnInit {

    dataSource = new MatTableDataSource<Group>();

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    displayedColumns = ['name'];

    data: Group[] = [
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        },
        {
            name: 'test',
            id: 1
        }
    ]

    ngOnInit(): void {
        this.dataSource.data = this.data;
    }

}
