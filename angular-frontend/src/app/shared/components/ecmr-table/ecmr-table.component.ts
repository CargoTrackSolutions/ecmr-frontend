/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader, MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ecmr } from '../../../core/models/Ecmr';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTabBody, MatTabHeader } from '@angular/material/tabs';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkScrollable } from '@angular/cdk/overlay';
import { ShowColumns } from '../../../features/ecmr-overview/show-columns';
import { FilterRequest } from '../../../features/ecmr-overview/filter-request';
import { EcmrService } from '../../services/ecmr.service';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { EcmrTransportType } from '../../../core/models/EcmrTransportType';
import { EcmrOverviewDetailsComponent } from '../../../features/ecmr-overview/ecmr-overview-details/ecmr-overview-details.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateFormatService } from '../../services/date-format.service';

@Component({
    selector: 'app-ecmr-table',
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
        NgTemplateOutlet,
        CdkAccordionModule,
        CommonModule,
        MatPaginator,
        EcmrOverviewDetailsComponent,
    ],
    templateUrl: './ecmr-table.component.html',
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    styleUrl: './ecmr-table.component.scss'
})
export class EcmrTableComponent implements OnInit {

    isMobile: boolean = false;
    breakpointSubscription: Subscription | undefined;

    displayedColumns: string[] = ['id', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate', 'licensePlate', 'carrierName', 'carrierPostCode', 'consigneePostCode'];
    columns: string[] = ['id', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate', 'licensePlate', 'carrierName', 'carrierPostCode', 'consigneePostCode'];
    filteredColumns: string[] = [];

    displayedColumnsMobile = ['content'];
    expandedElement: Ecmr | null = null;

    dataSource: MatTableDataSource<Ecmr> = new MatTableDataSource<Ecmr>();

    // toggle for filter selection
    showColumSelection: boolean = false;
    showFilter: boolean = false;

    // toggle for display of columns
    showColumns: ShowColumns = {
        id: true,
        referenceId: true,
        from: true,
        to: true,
        transportType: true,
        lastEditor: true,
        status: true,
        lastEditDate: true,
        creationDate: true,
        licensePlate: false,
        carrierName: false,
        carrierPostCode: false,
        consigneePostCode: false
    }

    filterFormGroup = new FormGroup({
        referenceId: new FormControl<string | null>(null),
        from: new FormControl<string | null>(null),
        to: new FormControl<string | null>(null),
        transportType: new FormControl<EcmrTransportType | null>(null),
        status: new FormControl<EcmrStatus | null>(null),
        licensePlate: new FormControl<string | null>(null),
        carrierName: new FormControl<string | null>(null),
        carrierPostCode: new FormControl<string | null>(null),
        consigneePostCode: new FormControl<string | null>(null),
    })

    @Input() quickViewButtons: TemplateRef<object>;
    @Input() actionButtons: TemplateRef<object>;
    @Input() mobileActionButtons: TemplateRef<object>;
    @Input() ecmr: Ecmr[];
    @Output() selectedEcmr = new EventEmitter<Ecmr>();
    @Output() filterRequest = new EventEmitter<FilterRequest>();

    toggledColumns = [this.showColumns.referenceId, this.showColumns.from, this.showColumns.to, this.showColumns.transportType, this.showColumns.lastEditor, this.showColumns.status, this.showColumns.lastEditDate, this.showColumns.creationDate];

    constructor(private _liveAnnouncer: LiveAnnouncer,
                public dialog: MatDialog,
                public snackbar: MatSnackBar,
                private ecmrService: EcmrService,
                private breakpointObserver: BreakpointObserver,
                public dateFormatService: DateFormatService,
                private router: Router) {
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort = new MatSort();

    @Output() paginating = new EventEmitter<PageEvent>();

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe((result) => {
                this.isMobile = result.matches;
            });

        this.initColumns();
    }

    showDetailsForEcmrAtIndex(index: number) {
        this.selectedEcmr.emit(this.dataSource.data[index])
    }

    initColumns() {
        //Check for saved column configuration
        const savedShowColumns: ShowColumns | null = this.ecmrService.getShowColumns();
        if (savedShowColumns) this.showColumns = savedShowColumns;

        //Check for saved column order configuration
        const savedColumns: string[] | null = this.ecmrService.getDisplayedColumns();
        if (savedColumns) {
            this.columns = savedColumns;
        }
        this.updateDisplayedColumns();
    }

    initFilter() {
        //Check for saved filter configuration
        const savedFilterRequest: FilterRequest | null = this.ecmrService.getFilterRequest();
        if (savedFilterRequest) {
            this.filterFormGroup.patchValue(savedFilterRequest)
        }
        //Subscribes to filter value changes
        this.filterFormGroup.valueChanges.subscribe(() => {
            const filterRequest: FilterRequest = this.getFilterValues();
            this.ecmrService.saveFilterRequest(filterRequest);
            this.filterRequest.emit(filterRequest);
        })
        this.dataSource.sort = this.sort;
    }

    getFilterValues(): FilterRequest {
        const formGroup = this.filterFormGroup.controls
        return {
            referenceId: formGroup.referenceId.value != '' ? formGroup.referenceId.value : null,
            from: formGroup.from.value != '' ? formGroup.from.value : null,
            to: formGroup.to.value != '' ? formGroup.to.value : null,
            transportType: formGroup.transportType.value ? formGroup.transportType.value : null,
            status: formGroup.status.value ? formGroup.status.value : null,
            licensePlate: formGroup.licensePlate.value != '' ? formGroup.licensePlate.value : null,
            carrierName: formGroup.carrierName.value != '' ? formGroup.carrierName.value : null,
            carrierPostCode: formGroup.carrierPostCode.value != '' ? formGroup.carrierPostCode.value : null,
            consigneePostCode: formGroup.consigneePostCode.value != '' ? formGroup.consigneePostCode.value : null,
        }
    }

    updateDisplayedColumns() {
        this.displayedColumns = this.columns.filter(column => this.showColumns[column as keyof ShowColumns]);
    }

    sortData(sort: Sort) {
        this.announceSortChange(sort);

        // TODO: change to request with sorting parameter
        const data = this.dataSource.data.slice();
        this.dataSource.data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'referenceId':
                    return compare(a.ecmrConsignment.referenceIdentificationNumber.value, b.ecmrConsignment.referenceIdentificationNumber.value, isAsc);
                case 'from':
                    return compare(a.ecmrConsignment.senderInformation.senderNameCompany, b.ecmrConsignment.senderInformation.senderNameCompany, isAsc);
                case 'to':
                    return compare(a.ecmrConsignment.consigneeInformation.consigneeNameCompany, b.ecmrConsignment.consigneeInformation.consigneeNameCompany, isAsc);
                case 'transportType':
                    return compare(a.ecmrConsignment.sendersInstructions.transportInstructionsDescription, b.ecmrConsignment.sendersInstructions.transportInstructionsDescription, isAsc);
                case 'lastEditor':
                    return compare(a.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.userName, b.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.userName, isAsc);
                case 'status':
                    return compare(a.ecmrConsignment.carriersReservationsAndObservationsOnTakingOverTheGoods.carrierReservationsObservations, b.ecmrConsignment.carriersReservationsAndObservationsOnTakingOverTheGoods.carrierReservationsObservations, isAsc);
                case 'lastEditDate':
                    return compare(a.ecmrConsignment.successiveCarrierInformation.successiveCarrierSignatureDate!, b.ecmrConsignment.successiveCarrierInformation.successiveCarrierSignatureDate!, isAsc);
                case 'creationDate':
                    return compare(a.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp, b.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp, isAsc);
                default:
                    return 0;
            }
        });
    }

    //DragDrop function to move and save columns
    tableDrop(event: CdkDragDrop<string[]>) {
        const movedColumn = this.displayedColumns[event.previousIndex];
        const actualPreviousIndex = this.columns.indexOf(movedColumn);
        let actualCurrentIndex = event.currentIndex;
        if (actualCurrentIndex >= this.columns.length) {
            actualCurrentIndex = this.columns.length - 1;
        }
        if (actualPreviousIndex > 0 && actualCurrentIndex > 0) {
            moveItemInArray(this.columns, actualPreviousIndex, actualCurrentIndex);
        }
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
        this.ecmrService.saveDisplayedColumns(this.columns);
    }

    /**
     * Trigger the sortState, i.e. whether the column should be sorted ascending, descending or not at all.
     * @param sortState
     */
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    /**
     * Toggle the {@link #showColumSelection} to show filter selection menu.
     */
    toggleColumnSelectionMenu() {
        this.showColumSelection = !this.showColumSelection;
    }

    toggleColumnAtIndex(index: number) {
        return this.toggledColumns[index] = !this.toggledColumns[index];
    }

    toggleColumnAtKey(key: string) {
        this.showColumns[key as keyof ShowColumns] = !this.showColumns[key as keyof ShowColumns];
    }

    toggleFilterListIcon() {
        this.showFilter = !this.showFilter;
    }

    getFilterListIcon() {
        return this.showFilter ? 'filter_list_off' : 'filter_list';
    }

    /**
     * Update the table's columns and only show active columns
     */
    updateColumns() {
        this.displayedColumns = [];
        this.columns.forEach(column => {
            if (this.showColumns[column as keyof ShowColumns]) {
                this.displayedColumns.push(column);
            }
        })
        this.ecmrService.saveShowColumns(this.showColumns);

        this.showColumSelection = false;
    }

    // eslint-disable-next-line
    sortPredicate(index: number, item: CdkDrag<number>) {
        return index != 0;
    }

    protected readonly JSON = JSON;
    protected readonly EcmrStatus = EcmrStatus;
    protected readonly EcmrTransportType = EcmrTransportType;

    getTransportType(ecmr: Ecmr) {
        const senderCountryCode = ecmr.ecmrConsignment.senderInformation.senderCountryCode.value;
        const consigneeCountryCode = ecmr.ecmrConsignment.consigneeInformation.consigneeCountryCode.value;
        if (!senderCountryCode || !consigneeCountryCode) {
            return null;
        }
        return senderCountryCode === consigneeCountryCode
            ? EcmrTransportType.National
            : EcmrTransportType.International;
    }

    closeColumnSelection() {
        const savedShowColumns: ShowColumns | null = this.ecmrService.getShowColumns();
        if (savedShowColumns) this.showColumns = savedShowColumns;
        this.showColumSelection = false;
    }

    onPageEvent($event: PageEvent) {
        this.filterRequest.emit(this.getFilterValues());
    }
}

function compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
    if (a && b) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    return 0
}
