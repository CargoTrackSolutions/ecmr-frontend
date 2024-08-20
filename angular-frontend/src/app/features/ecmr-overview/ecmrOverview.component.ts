/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
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
    MatTableDataSource,
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
import { EMPTY, Observable, Subscription, switchMap } from 'rxjs';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { LoadingService } from '../../core/services/loading.service';
import { HttpResponse } from '@angular/common/http';
import { MatDrawer, MatDrawerContainer, MatSidenavContainer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';

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
export class EcmrOverviewComponent implements OnInit {

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
                private translateService: TranslateService,
                private loadingService: LoadingService,
                private breakpointObserver: BreakpointObserver,) {
    }

    // ecmr selected
    selectedEcmr: Ecmr | null = null;

    ecmr: Ecmr[] = [];

    showDetails: boolean = false;

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe((result) => {
                this.isMobile = result.matches;
            });

        this.loadData().subscribe(data => {
            this.updateTableData(data);
        });
    }

    loadData(): Observable<Ecmr[]> {
        return this.ecmrService.getAllEcmr();
    }

    updateTableData(data: Ecmr[]) {
        this.table.dataSource = new MatTableDataSource(data);
        this.table.ecmr = data;
        this.ecmr = data;
        this.table.initFilter();
    }

    createNewEcmr() {
        this.router.navigateByUrl('/ecmr-editor');
    }

    // TODO: implement Import-function for eCMR
    importEcmr() {
        this.dialog.open(EcmrImportDialogComponent).afterClosed().subscribe(result => {
            if (result) {
                this.loadData().subscribe(data => {
                    this.updateTableData(data);
                });
            }
        });
    }

    // TODO: implement Share-function for eCMR
    shareEcmr(ecmr: Ecmr) {
        this.dialog.open(ShareEcmrDialogComponent, {
            width: '800px',
            maxWidth: '90vw',
            data: ecmr
        });
    }

    editEcmr(ecmrId: string) {
        console.log(ecmrId);
        if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}`);
    }

    deleteEcmr(ecmrId: string) {
        if (ecmrId) {
            this.ecmrService.deleteEcmr(ecmrId).pipe(
                switchMap(() => this.loadData())
            ).subscribe(data => {
                this.updateTableData(data);
            });
        }
    }

    // TODO: implement
    historyOfEcmr() {
        this.snackbar.open('Not implemented yet.', '', {duration: 3000});
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

    // TODO: implement Guest Access-function for eCMR
    guestAccessToEcmr() {
        this.snackbar.open('Not implemented yet.', '', {duration: 3000});
    }

    onCopyEcmr(ecmrId: string | null | undefined) {
        if (ecmrId) {
            this.router.navigateByUrl(`/ecmr-editor/${ecmrId}/copy`);
        }
    }

    downloadPdf(ecmrId: string) {
        this.loadingService.showLoaderUntilCompleted(this.ecmrService.downloadPdf(ecmrId)).subscribe((response: HttpResponse<Blob>) => {
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'ecmr-report.pdf';

            if (contentDisposition) {
                const matches = /filename="([^"]*)"/.exec(contentDisposition);
                if (matches?.[1]) {
                    fileName = matches[1];
                }
            }
            if (response.body) {
                const file = new Blob([response.body], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = fileName;
                link.target = '_blank';
                link.click();
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
}
