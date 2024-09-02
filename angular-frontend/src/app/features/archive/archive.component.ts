/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { EcmrOverviewDetailsComponent } from '../ecmr-overview/ecmr-overview-details/ecmr-overview-details.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Ecmr } from '../../core/models/Ecmr';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { FilterRequest } from '../ecmr-overview/filter-request';
import { EcmrPage } from '../../core/models/EcmrPage';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { Router } from '@angular/router';

@Component({
    selector: 'app-archive',
    standalone: true,
    imports: [
        EcmrTableComponent,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatSuffix,
        MatToolbar,
        MatToolbarRow,
        TranslateModule,
        EcmrOverviewDetailsComponent,
        MatDrawer,
        MatDrawerContainer,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatTooltip,
        MatMenuTrigger,
        NgClass
    ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit, AfterViewInit {
    @ViewChild(EcmrTableComponent) table: EcmrTableComponent;

    selectedEcmr: Ecmr | null = null;

    ecmr: Ecmr[] = [];

    breakpointSubscription: Subscription | undefined;
    isMobile: boolean = false

    filterRequest: FilterRequest = {
        referenceId: null,
        from: null,
        to: null,
        transportType: null,
        status: null,
        licensePlate: null,
        carrierName: null,
        carrierPostCode: null,
        consigneePostCode: null,
    };

    constructor(public dialog: MatDialog, public snackbar: MatSnackBar, public ecmrService: EcmrService, private breakpointObserver: BreakpointObserver,
                private translateService: TranslateService, protected ecmrActionService: EcmrActionService,private router: Router) {
    }

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
        ]).subscribe(result => {
            this.isMobile = result.matches;
        });
        const savedFilterRequest = this.ecmrService.getFilterRequest();
        if (savedFilterRequest) this.filterRequest = savedFilterRequest;
    }

    ngAfterViewInit() {
        this.loadData().subscribe(data => {
            this.updateTableData(data);
            this.table.initFilter();
        });
    }

    updateTableData(data: EcmrPage) {
        this.table.dataSource.data = data.ecmrs;
        this.table.ecmr = data.ecmrs;
        this.ecmr = data.ecmrs;
        this.table.paginator.length = data.totalElements;
    }

    loadData() {
        const paginator = this.table.paginator
        if (this.table.sort?.active) {
            return this.ecmrService.getAllArchivedEcmr(this.filterRequest, paginator.pageIndex, paginator.pageSize, this.table.sort.active, this.table.sort.direction.toUpperCase());
        } else {
            return this.ecmrService.getAllArchivedEcmr(this.filterRequest, paginator.pageIndex, paginator.pageSize, 'referenceId', '');
        }

    }

    moveToOverview(ecmrId: string) {
        const confirmationMessage = this.translateService.instant('archive.confirmation_message');
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {text: confirmationMessage}
        })

        dialogRef.afterClosed().pipe(
            switchMap(result => {
                if (result.isConfirmed) {
                    return this.ecmrService.moveOutOfArchive(ecmrId);
                } else {
                    return EMPTY;
                }
            })
        ).subscribe({
            next: () => {
                this.loadData();
                this.selectedEcmr = null;
            },
            error: err => {
                const action = this.translateService.instant('general.snackbar_action');
                const message = this.translateService.instant('general.snackbar_error');
                this.snackbar.open(message, action, {duration: 3000});
                console.log(err);
            }
        });
    }

    selectEcmr(ecmr: Ecmr | null) {
        this.selectedEcmr = ecmr;
    }

    closeDetailView($event: boolean) {
        if ($event)
            this.selectEcmr(null)
    }

    onFilterRequest(request: FilterRequest) {
        this.filterRequest = request;
        this.loadData().subscribe(data => {
            this.updateTableData(data);
        });
    }

    protected readonly EcmrStatus = EcmrStatus;

    historyOfEcmr(ecmrId: string, refId: string) {
        if (ecmrId) this.router.navigateByUrl(`/history/${ecmrId}/${refId}`);
    }
}
