/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EcmrOverviewDetailsComponent } from './ecmr-overview-details/ecmr-overview-details.component';


import { Ecmr } from '../../core/models/Ecmr';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { catchError, filter, Observable, of, Subscription, switchMap } from 'rxjs';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { FilterRequest } from './filter-request';
import { EcmrPage } from '../../core/models/EcmrPage';
import { LoadingService } from '../../core/services/loading.service';
import { EcmrType } from '../../core/models/EcmrType';
import { SnackbarService } from '../../core/services/snackbar.service';
import {
  ExternalEcmrImportDialogComponent
} from "./dialog/external-ecmr-import-dialog/external-ecmr-import-dialog.component";

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [
        MatToolbar,
        MatToolbarRow,
        MatIcon,
        MatButton,
        MatLabel,
        MatTableModule,
        MatSortModule,
        MatIconButton,
        ReactiveFormsModule,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        TranslateModule,
        EcmrTableComponent,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        TranslateModule,
        EcmrOverviewDetailsComponent,
        MatDrawer,
        MatDrawerContainer,
        NgClass
    ],
    templateUrl: './ecmrOverview.component.html',
    styleUrl: './ecmrOverview.component.scss'
})
export class EcmrOverviewComponent implements OnInit, AfterViewInit {

    isMobile: boolean = false;
    breakpointSubscription: Subscription | undefined;

    @ViewChild(EcmrTableComponent) table: EcmrTableComponent;
    @ViewChild(MatSort) sort: MatSort = new MatSort();

    constructor(public dialog: MatDialog,
                public snackbar: MatSnackBar,
                public ecmrService: EcmrService,
                private router: Router,
                private loadingService: LoadingService,
                private translateService: TranslateService,
                private breakpointObserver: BreakpointObserver,
                protected ecmrActionService: EcmrActionService,
                private snackBarService: SnackbarService) {
    }

    // ecmr selected
    selectedEcmr: Ecmr | null = null;
    selectedEcmrRoles: EcmrRole[];
    shareButtonDisabled: boolean = true;

    ecmr: Ecmr[] = [];

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

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe((result) => {
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

    loadData(): Observable<EcmrPage> {
        const paginator = this.table.paginator
        if (this.isMobile) {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ECMR, paginator.pageIndex, paginator.pageSize, 'creationDate', 'ASC'));
        } else {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ECMR, paginator.pageIndex, paginator.pageSize, this.table.sort.active, this.table.sort.direction.toUpperCase()));
        }
    }

    updateTableData(data: EcmrPage) {
        this.table.dataSource.data = data.ecmrs;
        this.table.ecmr = data.ecmrs;
        this.ecmr = data.ecmrs;
        this.table.paginator.length = data.totalElements;
    }

    createNewEcmr() {
        this.router.navigateByUrl('/ecmr-editor');
    }

    /* TODO wird später implementiert
    importEcmr() {
        this.dialog.open(EcmrImportDialogComponent).afterClosed().subscribe(result => {
            if (result) {
                this.loadData().subscribe(data => {
                    this.updateTableData(data);
                });
            }
        });
    }*/

    importExternalEcmr(){
      this.dialog.open(ExternalEcmrImportDialogComponent,
        {
          width: '30vw'
        }).afterClosed().pipe(
          switchMap(result => {
            if(result) {
              return this.loadData()
            }
            return of(null)
          })
      ).subscribe(data => {
        if(data) {
          this.updateTableData(data);
        }
      })
    }

    shareEcmr(ecmr: Ecmr) {
      if (ecmr?.ecmrId) {
        this.ecmrService.getEcmrRolesForCurrentUser(ecmr?.ecmrId).subscribe(roles => {
            this.selectedEcmrRoles = roles
            this.shareButtonDisabled = (this.selectedEcmrRoles.includes(EcmrRole.Consignee) || this.selectedEcmrRoles.includes(EcmrRole.Reader)) && this.selectedEcmrRoles.length === 1;
            this.dialog.open(ShareEcmrDialogComponent, {
                width: '800px',
                maxWidth: '90vw',
                data: {
                    ecmr: ecmr,
                    roles: this.selectedEcmrRoles,
                    isExternalUser: false
                }
            });
        })
      }
    }

    editEcmr(ecmrId: string) {
        if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}`);
    }

    signEcmr(ecmrId: string) {
        if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}?action=sign`); // or /sign or sign=true
    }

    deleteEcmr(ecmrId: string) {
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'overview.delete_ecmr_dialog_text'
            }
        }).afterClosed().pipe(
            filter(dialogResult => dialogResult.isConfirmed === true && !!ecmrId),
            switchMap(() => this.ecmrService.deleteEcmr(ecmrId)),
            switchMap(() => this.loadData())
        ).subscribe(data => {
            this.snackBarService.openSuccessSnackbar("overview.delete_success");
            this.updateTableData(data);
        });
    }

    deleteButtonVisible(ecmr: Ecmr) {
        return ecmr.ecmrConsignment.signatureOrStampOfTheSender.senderSignature === null
            && ecmr.ecmrStatus === EcmrStatus.NEW
    }


    historyOfEcmr(ecmrId: string, refId: string) {
        if (ecmrId) this.router.navigateByUrl(`/history/${ecmrId}/${refId}`);
    }

    moveToArchive(ecmrId: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'overview.confirmation_message',
                checkBoxText: 'confirmation.checkbox',
            },
        });
        dialogRef.afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(result => {
                if (result.isCheckboxTicked) {
                    this.onCopyEcmr(ecmrId);
                }
                return this.ecmrService.moveToArchive(ecmrId);
            }),
            switchMap(() => this.loadData()),
            catchError(err => {
                this.snackBarService.openErrorSnackbar("general.snackbar_error");
                console.error(err);
                return of(null)
            }),
        ).subscribe(data => {
            if (data) {
                this.snackBarService.openSuccessSnackbar("overview.move_to_archive_success");
                this.updateTableData(data);
                this.selectedEcmr = null;
            }
        });
    }

    onCopyEcmr(ecmrId: string | null | undefined) {
        if (ecmrId) {
            this.router.navigateByUrl(`/ecmr-editor/${ecmrId}/copy`);
        }
    }

    selectEcmr(ecmr: Ecmr | null) {
        if (ecmr?.ecmrId) {
            this.ecmrService.getEcmrRolesForCurrentUser(ecmr?.ecmrId).subscribe(roles => {
                this.selectedEcmrRoles = roles
                this.shareButtonDisabled = (this.selectedEcmrRoles.includes(EcmrRole.Consignee) || this.selectedEcmrRoles.includes(EcmrRole.Reader)) && this.selectedEcmrRoles.length === 1;
            })
        }
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
}
