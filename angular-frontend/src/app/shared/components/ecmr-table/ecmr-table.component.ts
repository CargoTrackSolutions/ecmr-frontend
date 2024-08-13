/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
import { NgIf, NgTemplateOutlet } from '@angular/common';
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
import { CommonModule } from '@angular/common';
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
    lastEditor: new FormControl<string | null>(null),
    status: new FormControl<EcmrStatus | null>(null),
    lastEditorDate: new FormControl<Date | null>(null),
    lastCreationDate: new FormControl<Date | null>(null),
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
      this.filterTable(savedFilterRequest);
      this.filterFormGroup.patchValue(savedFilterRequest)
      this.dataSource.paginator = this.paginator;
    }
    //Subscribes to filter value changes
    this.filterFormGroup.valueChanges.subscribe(() => {
      const filterRequest: FilterRequest = this.filterFormGroup.getRawValue();
      this.ecmrService.saveFilterRequest(filterRequest);
      this.filterTable(filterRequest);
    })
    this.dataSource.sort = this.sort;
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
    console.log('filter status: ' + this.showColumSelection);
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

  // TODO: implement Share-function for eCMR
  shareEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  // TODO: implement Delete-function for eCMR
  deleteEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  editEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  // TODO: implement History-function for eCMR
  historyOfEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  // TODO: implement Guest Access-function for eCMR
  guestAccessToEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  // TODO: implement Show-function for eCMR
  showEcmr() {
    this.snackbar.open('Not implemented yet.', '', { duration: 3000 });
  }

  // TODO: implement Download-function for eCMR
  downloadPDF() {
    this.snackbar.open('Not implemented yet.', '', { duration: 3000 });
  }

  private filterTable(filterRequest: FilterRequest) {
    this.dataSource.data = this.ecmr;
    if (filterRequest.referenceId) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.referenceIdentificationNumber.value?.toLowerCase().includes(filterRequest.referenceId!.toLowerCase()))
    }
    if (filterRequest.from) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.senderInformation.senderNameCompany?.toLowerCase().includes(filterRequest.from!.toLowerCase()))
    }
    if (filterRequest.to) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.consigneeInformation.consigneeNameCompany?.toLowerCase().includes(filterRequest.to!.toLowerCase()))
    }
    if (filterRequest.transportType) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => this.getTransportType(ecmr) === filterRequest.transportType)
    }
    if (filterRequest.lastEditor) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.editedBy?.toLowerCase().includes(filterRequest.lastEditor!.toLowerCase()))
    }
    if (filterRequest.status) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrStatus === filterRequest.status)
    }
    if (filterRequest.lastEditorDate) {
      const filterDate = new Date(filterRequest.lastEditorDate);
      this.dataSource.data = this.dataSource.data.filter(ecmr => {
        const editDate = ecmr.editedAt ? new Date(ecmr.editedAt) : undefined;
        return editDate && editDate >= filterDate;
      });
    }
    if (filterRequest.lastCreationDate) {
      const filterDate = new Date(filterRequest.lastCreationDate);
      this.dataSource.data = this.dataSource.data.filter(ecmr => {
        const creationDate = ecmr.createdAt ? new Date(ecmr.createdAt) : undefined;
        return creationDate && creationDate >= filterDate;
      });
    }
    if (filterRequest.licensePlate) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.carrierInformation.carrierLicensePlate?.toLowerCase().includes(filterRequest.licensePlate!.toLowerCase()))
    }
    if (filterRequest.carrierName) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.carrierInformation.carrierNameCompany?.toLowerCase().includes(filterRequest.carrierName!.toLowerCase()))
    }
    if (filterRequest.carrierPostCode) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.carrierInformation.carrierPostcode?.includes(filterRequest.carrierPostCode!))
    }
    if (filterRequest.consigneePostCode) {
      this.dataSource.data = this.dataSource.data.filter(ecmr => ecmr.ecmrConsignment.consigneeInformation.consigneePostcode?.includes(filterRequest.consigneePostCode!))
    }
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
      ? EcmrTransportType.NATIONAL
      : EcmrTransportType.INTERNATIONAL;
  }
}

function compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
  if (a && b) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  return 0
}
