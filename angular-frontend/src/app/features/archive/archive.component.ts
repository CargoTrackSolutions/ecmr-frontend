/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { catchError, filter, forkJoin, Observable, of, Subscription, switchMap } from 'rxjs';
import { EcmrOverviewDetailsComponent } from '../ecmr-overview/ecmr-overview-details/ecmr-overview-details.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Ecmr } from '../../core/models/Ecmr';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { FilterRequest } from '../ecmr-overview/filter-request';
import { EcmrPage } from '../../core/models/EcmrPage';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { Router } from '@angular/router';
import { EcmrType } from '../../core/models/EcmrType';
import { LoadingService } from '../../core/services/loading.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Sort } from '@angular/material/sort';
import { SealMetadataService } from '../../shared/services/seal-metadata.service';
import { SealMetadata } from '../../core/models/SealMetadata';
import { DocumentModel } from '../../core/models/DocumentModel';
import { DocumentService } from '../../shared/services/document.service';

@Component({
    selector: 'app-archive',
    imports: [
        EcmrTableComponent,
        MatButton,
        MatIcon,
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

    ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit, AfterViewInit {
    dialog = inject(MatDialog);
    snackbarService = inject(SnackbarService);
    ecmrService = inject(EcmrService);
    private breakpointObserver = inject(BreakpointObserver);
    protected ecmrActionService = inject(EcmrActionService);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    private sealMetadataService = inject(SealMetadataService);
    private documentService = inject(DocumentService);

    @ViewChild(EcmrTableComponent) table: EcmrTableComponent;

    selectedEcmr: Ecmr | null = null;
    selectedEcmrSealMetadata: SealMetadata[] = [];
    selectedEcmrDocuments: DocumentModel[] = [];

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
        lastEditor: null
    };

    initialSort: Sort = {active: '', direction: ''};
    readonly ecmrType: EcmrType = EcmrType.ARCHIVED;

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
        ]).subscribe(result => {
            this.isMobile = result.matches;
        });
        const savedFilterRequest = this.ecmrService.getFilterRequest();
        if (savedFilterRequest) this.filterRequest = savedFilterRequest;

        if (!this.isMobile) {
            const savedSort = this.ecmrService.getEcmrSort(this.ecmrType);
            if (savedSort) this.initialSort = savedSort;
        }
    }

    ngAfterViewInit() {
        this.loadData().subscribe(data => {
            this.updateTableData(data);
            this.table.initFilter();
        });
    }

    updateTableData(data: EcmrPage) {
        this.table.dataSource.data = data.ecmrs;
        this.table.ecmr.set(data.ecmrs)
        this.ecmr = data.ecmrs;
        this.table.paginator.length = data.totalElements;
    }

    loadData(): Observable<EcmrPage> {
        const paginator = this.table.paginator
        if (this.table.sort?.active && this.table.sort?.direction) {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ARCHIVED, paginator.pageIndex, paginator.pageSize, this.table.sort.active, this.table.sort.direction.toUpperCase()));
        } else {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ARCHIVED, paginator.pageIndex, paginator.pageSize, 'creationDate', 'ASC'));
        }

    }

    moveToOverview(ecmrId: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {text: 'archive.confirmation_message'}
        })

        dialogRef.afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(() => this.ecmrService.moveOutOfArchive(ecmrId)),
            switchMap(() => this.loadData()),
            catchError(err => {
                this.snackbarService.openErrorSnackbar('general.snackbar_error')
                console.log(err);
                return of(null)
            })
        ).subscribe(result => {
            if (result) {
                this.updateTableData(result);
                this.selectedEcmr = null;
                this.snackbarService.openSuccessSnackbar('archive.move_to_overview_success');
            }
        });
    }

    selectEcmr(ecmr: Ecmr | null) {
        this.selectedEcmrSealMetadata = [];
        this.selectedEcmr = ecmr;

        if (!ecmr?.ecmrId) {
            return;
        }
        const obs = forkJoin([this.sealMetadataService.getSealMetadata(ecmr.ecmrId), this.documentService.getDocuments(ecmr.ecmrId)]);
        obs.pipe(
            catchError(err => {
                this.snackbarService.openErrorSnackbar('general.snackbar_error')
                console.log(err);
                return of([]);
            }))
            .subscribe(([sealMetadata, documents]) => {
                this.selectedEcmrSealMetadata = sealMetadata;
                this.selectedEcmrDocuments = documents;
            })
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
