/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
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
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { Group } from '../../../core/models/Group';
import { EcmrUser } from '../../../core/models/EcmrUser';
import { MatTooltip } from '@angular/material/tooltip';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../group.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { MatChip } from '@angular/material/chips';

@Component({
    selector: 'app-group-detail-view',
    imports: [
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatLabel,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatTable,
        MatToolbar,
        MatToolbarRow,
        TranslateModule,
        MatHeaderCellDef,
        MatCell,
        MatIconButton,
        MatTooltip,
        MatSortModule,
        MatFormField,
        MatInput,
        MatSuffix,
        MatChip
    ],
    templateUrl: './group-detail-view.component.html',
    styleUrl: './group-detail-view.component.scss'
})
export class GroupDetailViewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private groupService = inject(GroupService);


    dataSource = new MatTableDataSource<EcmrUser>();

    displayedColumns = ['actions', 'firstName', 'lastName', 'email', 'phone', 'role'];

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) sort: MatSort;

    selectedGroup: Group | null;
    groupId: number;

    sub: Subscription;

    ngOnInit() {
        this.sub = this.route.params.pipe(
            switchMap(params => {
                this.groupId = params['id'];
                return forkJoin([
                    this.groupService.getUsersForGroup(this.groupId),
                    this.groupService.getGroupWithId(this.groupId)
                ]);
            })
        ).subscribe(([users, group]) => {
            this.dataSource.data = users;
            this.selectedGroup = group;
        });

        this.dataSource.filterPredicate = (data: EcmrUser, filter: string) => {
            if (data.firstName.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.lastName.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.email.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.phone?.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.role.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else {
                return false
            }
        };

        this.dataSource.sort = this.sort;
    }

    sortData(sort: Sort) {
        const data = this.dataSource.data;
        this.dataSource.data = data.toSorted((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'firstName':
                    return this.compare(a.firstName, b.firstName, isAsc);
                case 'lastName':
                    return this.compare(a.lastName, b.lastName, isAsc);
                case 'email':
                    return this.compare(a.email, b.email, isAsc);
                case 'phone':
                    return this.compare(a.phone, b.phone, isAsc);
                case 'role':
                    return this.compare(a.role, b.role, isAsc);
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
    }
}
