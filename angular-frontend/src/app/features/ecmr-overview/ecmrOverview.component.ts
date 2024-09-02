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
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
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
    MatTableModule
} from '@angular/material/table';
import { MatTabBody, MatTabHeader } from '@angular/material/tabs';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { EcmrImportDialogComponent } from './dialog/import/ecmr-import-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgClass, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MatDivider } from '@angular/material/divider';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EcmrOverviewDetailsComponent } from './ecmr-overview-details/ecmr-overview-details.component';


import { Ecmr } from '../../core/models/Ecmr';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { EMPTY, filter, Observable, Subscription, switchMap } from 'rxjs';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDrawer, MatDrawerContainer, MatSidenavContainer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { FilterRequest } from './filter-request';
import { EcmrPage } from '../../core/models/EcmrPage';
import { LoadingService } from '../../core/services/loading.service';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [
        MatToolbar,
        MatToolbarRow,
        MatIcon,
        MatButton,
        MatLabel,
        MatTable,
        MatTabHeader,
        MatTabBody,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatCell,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatHeaderRow,
        MatTableModule,
        MatInput,
        MatFormField,
        MatPrefix,
        MatSuffix,
        MatSort,
        MatSortHeader,
        MatSortModule,
        MatIconButton,
        MatButtonToggleGroup,
        MatButtonToggle,
        MatCheckbox,
        MatSelect,
        ReactiveFormsModule,
        MatOption,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionPanelHeader,
        MatDialogContent,
        MatDialogTitle,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        NgIf,
        MatCard,
        MatCardContent,
        MatMiniFabButton,
        CdkScrollable,
        MatDivider,
        CdkDropList,
        CdkDrag,
        TranslateModule,
        EcmrTableComponent,
        MatDialogContent,
        MatDialogTitle,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        NgIf,
        MatCard,
        MatCardContent,
        MatMiniFabButton,
        CdkScrollable,
        MatDivider,
        CdkDropList,
        CdkDrag,
        TranslateModule,
        EcmrOverviewDetailsComponent,
        MatSidenavContainer,
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
    dataSourceIndex: number;

    constructor(private _liveAnnouncer: LiveAnnouncer,
                public dialog: MatDialog,
                public snackbar: MatSnackBar,
                public ecmrService: EcmrService,
                private router: Router,
                private loadingService: LoadingService,
                private translateService: TranslateService,
                private breakpointObserver: BreakpointObserver,
                protected ecmrActionService: EcmrActionService) {
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
    };

    showDetails: boolean = false;

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
        this.loadingService.showLoaderUntilCompleted(this.loadData()).subscribe(data => {
            this.updateTableData(data);
            this.table.initFilter();
        });
    }

    loadData(): Observable<EcmrPage> {
        const paginator = this.table.paginator
        if (this.isMobile) {
            return this.ecmrService.getAllEcmr(this.filterRequest, paginator.pageIndex, paginator.pageSize, null, '');
        } else {
            return this.ecmrService.getAllEcmr(this.filterRequest, paginator.pageIndex, paginator.pageSize, this.table.sort.active, this.table.sort.direction.toUpperCase());
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

    importEcmr() {
        this.dialog.open(EcmrImportDialogComponent).afterClosed().subscribe(result => {
            if (result) {
                this.loadData().subscribe(data => {
                    this.updateTableData(data);
                });
            }
        });
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
            switchMap(result => {
                if (result.isConfirmed) {
                    if (result.isCheckboxTicked) {
                        this.onCopyEcmr(ecmrId);
                    }
                    return this.ecmrService.moveToArchive(ecmrId);
                } else {
                    return EMPTY;
                }
            }),
            switchMap(() => this.loadData())
        ).subscribe({
            next: data => {
                this.updateTableData(data);
                this.selectedEcmr = null;
            },
            error: err => {
                const action = this.translateService.instant('general.snackbar_action');
                const message = this.translateService.instant('general.snackbar_error');
                this.snackbar.open(message, action, {duration: 3000});
                console.error(err);
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
