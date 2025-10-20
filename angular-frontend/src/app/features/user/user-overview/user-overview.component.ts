/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { EcmrUser } from '../../../core/models/EcmrUser';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { UserService } from '../../../shared/services/user.service';
import { filter, switchMap } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInput } from '@angular/material/input';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthenticatedUser } from '../../../core/models/AuthenticatedUser';
import { NgClass } from '@angular/common';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
    selector: 'app-user-overview',
    imports: [
        MatButton,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconButton,
        MatLabel,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatTable,
        MatToolbar,
        MatToolbarRow,
        MatTooltip,
        TranslateModule,
        MatHeaderCellDef,
        MatSort,
        MatSortModule,
        MatFormField,
        MatInput,
        MatSuffix,
        NgClass
    ],
    templateUrl: './user-overview.component.html',
    styleUrl: './user-overview.component.scss'
})
export class UserOverviewComponent implements OnInit {
    private userService = inject(UserService);
    private matDialog = inject(MatDialog);
    private snackBarService = inject(SnackbarService);


    dataSource = new MatTableDataSource<EcmrUser>();

    displayedColumns = ['actions', 'firstName', 'lastName', 'email', 'phone', 'role'];
    authenticatedUser: AuthenticatedUser;

    @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) sort: MatSort;

    constructor() {
        const authService = inject(AuthService);

        authService.getAuthenticatedUser().subscribe(user => {
            if(user) this.authenticatedUser = user
        });
    }

    ngOnInit() {
        this.userService.getAllUsers().subscribe(user => {
            this.dataSource.data = user;
        })

        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: EcmrUser, filter: string) => {
            if (data.firstName.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.lastName.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.email.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else if (data.phone?.trim().toLowerCase().includes(filter.trim().toLowerCase())) {
                return true
            } else return data.role.trim().toLowerCase().includes(filter.trim().toLowerCase());
        };
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

    createNewUser() {
        this.matDialog.open(EditUserDialogComponent, {
            width: '60vw',
            maxWidth: '90vw'
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.userService.getAllUsers())
        ).subscribe(user => {
            this.dataSource.data = user;
        })
    }

    editUser(user: EcmrUser) {
        this.matDialog.open(EditUserDialogComponent, {
            width: '60vw',
            maxWidth: '90vw',
            data: user
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.userService.getAllUsers())
        ).subscribe(user => {
            this.dataSource.data = user;
        })
    }

    applyFilter(event: Event) {
        this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    }

    activateUser(userId: number) {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'user_overview.activate_dialog'
            }
        }).afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(() => this.userService.activateUser(userId)),
            switchMap(() => this.userService.getAllUsers())
        ).subscribe(users => {
            this.snackBarService.openSuccessSnackbar("user_overview.activate_success");
            this.dataSource.data = users;
        });
    }

    deactivateUser(userId: number) {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'user_overview.deactivate_dialog'
            }
        }).afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(() => this.userService.deactivateUser(userId)),
            switchMap(() => this.userService.getAllUsers())
        ).subscribe(users => {
            this.snackBarService.openSuccessSnackbar("user_overview.deactivate_success");
            this.dataSource.data = users;
        });
    }
}
