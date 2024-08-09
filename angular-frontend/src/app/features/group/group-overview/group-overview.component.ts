/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
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
import { GroupService } from '../group.service';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from '../group-edit-dialog/group-edit-dialog.component';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { filter, switchMap } from 'rxjs';

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
        MatPaginator,
        MatIconButton,
        MatTooltip,
        MatFormField,
        MatPrefix,
        MatInput,
        MatSuffix,
        MatSortModule
    ],
    templateUrl: './group-overview.component.html',
    styleUrl: './group-overview.component.scss'
})
export class GroupOverviewComponent implements OnInit {

    dataSource = new MatTableDataSource<Group>();

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) sort: MatSort;

    displayedColumns = ['actions', 'name', 'location'];

    constructor(private groupService: GroupService,
                private matDialog: MatDialog,
                private router: Router) {
    }

    ngOnInit(): void {
        this.groupService.getAllGroups().subscribe(data => {
            this.dataSource.data = data;
        })

        this.dataSource.filterPredicate = (data: Group, filter: string) => {
            const dataStr = data.name.toLowerCase() + data.location.name.toLowerCase();
            return dataStr.indexOf(filter) != -1;
        };

        this.dataSource.sort = this.sort;
    }

    sortData(sort: Sort) {
        const data = this.dataSource.data;
        this.dataSource.data = data.toSorted((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name':
                    return this.compare(a.name, b.name, isAsc);
                case 'location':
                    return this.compare(a.location.name, b.location.name, isAsc);
                default:
                    return 0;
            }
        });
    }

    compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
        if (a && b) {
            return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
        }
        return 0
    }

    openGroup(id: number) {
        this.router.navigateByUrl(`/group-detail/${id}`)
    }

    createNewGroup() {
        this.matDialog.open(GroupEditDialogComponent, {
            width: '600px'
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.groupService.getAllGroups())
        ).subscribe(groups => {
            this.dataSource.data = groups;
        })
    }

    editGroup(group: Group) {
        this.matDialog.open(GroupEditDialogComponent, {
            data: group,
            width: '600px'
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.groupService.getAllGroups())
        ).subscribe(groups => {
            this.dataSource.data = groups;
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
    }
}
