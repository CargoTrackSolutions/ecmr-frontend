/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, inject, input, model, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
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
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShowColumns } from '../../../features/ecmr-overview/show-columns';
import { FilterRequest } from '../../../features/ecmr-overview/filter-request';
import { EcmrService } from '../../services/ecmr.service';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { EcmrTransportType } from '../../../core/models/EcmrTransportType';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { debounceTime, Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DateFormatService } from '../../services/date-format.service';
import { EcmrStatusComponent } from '../ecmr-status/ecmr-status.component';
import { EcmrType } from '../../../core/models/EcmrType';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-ecmr-table',
    imports: [
        MatToolbar,
        MatToolbarRow,
        MatIcon,
        MatButton,
        MatLabel,
        MatTable,
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
        MatSuffix,
        MatSort,
        MatSortHeader,
        MatSortModule,
        MatIconButton,
        MatCheckbox,
        MatSelect,
        ReactiveFormsModule,
        MatOption,
        MatCard,
        CdkDropList,
        CdkDrag,
        TranslateModule,
        NgTemplateOutlet,
        CdkAccordionModule,
        CommonModule,
        MatPaginator,
        EcmrStatusComponent
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
    dialog = inject(MatDialog);
    snackbar = inject(MatSnackBar);
    private ecmrService = inject(EcmrService);
    private breakpointObserver = inject(BreakpointObserver);
    dateFormatService = inject(DateFormatService);


    isMobile: boolean = false;
    breakpointSubscription: Subscription | undefined;

    displayedColumns: string[] = ['id', 'ecmrId', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate', 'licensePlate', 'carrierName', 'carrierPostCode', 'consigneePostCode'];
    columns: string[] = ['id', 'ecmrId', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate', 'licensePlate', 'carrierName', 'carrierPostCode', 'consigneePostCode'];
    filteredColumns: string[] = [];

    displayedColumnsMobile = ['content'];
    expandedElement: Ecmr | null = null;

    dataSource: MatTableDataSource<Ecmr> = new MatTableDataSource<Ecmr>();

    // toggle for filter selection
    showColumSelection: boolean = false;
    showFilter: boolean = false;
    showCheckboxes: boolean = false;

    // toggle for display of columns
    showColumns: ShowColumns = {
        id: true,
        ecmrId: false,
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
        ecmrId: new FormControl<string | null>(null),
        referenceId: new FormControl<string | null>(null),
        from: new FormControl<string | null>(null),
        to: new FormControl<string | null>(null),
        transportType: new FormControl<EcmrTransportType | null>(null),
        status: new FormControl<EcmrStatus | null>(null),
        licensePlate: new FormControl<string | null>(null),
        carrierName: new FormControl<string | null>(null),
        carrierPostCode: new FormControl<string | null>(null),
        consigneePostCode: new FormControl<string | null>(null),
        lastEditor: new FormControl<string | null>(null),
    })

    readonly quickViewButtons = input<TemplateRef<object>>();
    readonly actionButtons = input<TemplateRef<object>>();
    readonly mobileActionButtons = input<TemplateRef<object>>();
    readonly ecmr = model<Ecmr[]>();
    readonly initialSort = input<Sort>({active: '', direction: ''});
    readonly ecmrType = input<EcmrType>(EcmrType.ECMR);
    readonly enableMultiselection = input<boolean>(false);
    @Output() selectedEcmr = new EventEmitter<Ecmr>();
    @Output() filterRequest = new EventEmitter<FilterRequest>();
    @Output() selectedEcmrs = new EventEmitter<Ecmr[]>();

    toggledColumns = [this.showColumns.referenceId, this.showColumns.from, this.showColumns.to, this.showColumns.transportType, this.showColumns.lastEditor, this.showColumns.status, this.showColumns.lastEditDate, this.showColumns.creationDate];

    selection = new SelectionModel<Ecmr>(true, []);

    pageSizeOptions: number[] = [10, 25, 50];
    currentPageSize: number = 10;

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

        this.currentPageSize = this.ecmrService.getEcmrPageSize(this.ecmrType());

        this.selection.changed.subscribe(() => {
          this.selectedEcmrs.emit(this.selection.selected);
        });
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
        this.filterFormGroup.valueChanges.pipe(
            debounceTime(500))
            .subscribe(() => {
                const filterRequest: FilterRequest = this.getFilterValues();
                this.ecmrService.saveFilterRequest(filterRequest);
                this.paginator.pageIndex = 0;
                this.filterRequest.emit(filterRequest);
            })
        this.dataSource.sort = this.sort;
    }

    getFilterValues(): FilterRequest {
        const formGroup = this.filterFormGroup.controls
        return {
            ecmrId: formGroup.ecmrId.value != '' ? formGroup.ecmrId.value : null,
            referenceId: formGroup.referenceId.value != '' ? formGroup.referenceId.value : null,
            from: formGroup.from.value != '' ? formGroup.from.value : null,
            to: formGroup.to.value != '' ? formGroup.to.value : null,
            transportType: formGroup.transportType.value ? formGroup.transportType.value : null,
            status: formGroup.status.value ? formGroup.status.value : null,
            licensePlate: formGroup.licensePlate.value != '' ? formGroup.licensePlate.value : null,
            carrierName: formGroup.carrierName.value != '' ? formGroup.carrierName.value : null,
            carrierPostCode: formGroup.carrierPostCode.value != '' ? formGroup.carrierPostCode.value : null,
            consigneePostCode: formGroup.consigneePostCode.value != '' ? formGroup.consigneePostCode.value : null,
            lastEditor: formGroup.lastEditor.value != '' ? formGroup.lastEditor.value : null,
        }
    }

    updateDisplayedColumns() {
        let filteredColumns = this.columns.filter(column => this.showColumns[column as keyof ShowColumns]);
        if (this.enableMultiselection()) {
          filteredColumns = ['select', ...filteredColumns];
        }

        this.displayedColumns = filteredColumns;
    }

    sortData() {
        this.filterRequest.emit(this.getFilterValues())
        this.initialSort().active = this.sort.active || '';
        this.initialSort().direction = this.sort.direction;
        this.ecmrService.saveEcmrSort(this.initialSort(), this.ecmrType());
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

    toggleMultiselectEcmrs() {
      this.showCheckboxes = !this.showCheckboxes;
      if(!this.showCheckboxes) {
        this.clearSelection();
      }
    }

    getFilterListIcon() {
        return this.showFilter ? 'filter_list_off' : 'filter_list';
    }

    /**
     * Update the table's columns and only show active columns
     */
    updateColumns() {
        this.displayedColumns = ['select'];
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
    protected readonly allEcmrStatus: EcmrStatus[] = Object.values(EcmrStatus);
    protected readonly EcmrTransportType = EcmrTransportType;

    closeColumnSelection() {
        const savedShowColumns: ShowColumns | null = this.ecmrService.getShowColumns();
        if (savedShowColumns) this.showColumns = savedShowColumns;
        this.showColumSelection = false;
    }

    onPageEvent($event: PageEvent) {
        if($event.pageSize !== this.currentPageSize) {
            this.currentPageSize = $event.pageSize;
            this.paginator.pageIndex = 0;
            this.ecmrService.saveEcmrPageSize(this.currentPageSize, this.ecmrType());
        }
        this.filterRequest.emit(this.getFilterValues());
    }

    public getTransportType(ecmr: Ecmr): EcmrTransportType | null {
      return this.ecmrService.getTransportType(ecmr);
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    toggleAllRows(): void {
      if(this.isAllSelected()){
        this.selection.clear();
        return;
      }
      this.selection.select(...this.dataSource.data);
    }

    checkboxLabel(row?: Ecmr): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ecmrId}`;
    }

    toggleRow(row: Ecmr): void {
      this.selection.toggle(row);
    }

    clearSelection(): void {
        this.selection.clear();
    }
}
