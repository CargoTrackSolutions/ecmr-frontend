/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {AfterViewInit, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatSort, MatSortHeader, MatSortModule, Sort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {EcmrData} from "../../../core/models/EcmrData";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatTabBody, MatTabHeader} from "@angular/material/tabs";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatOption, MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {CdkScrollable} from "@angular/cdk/overlay";

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
    NgTemplateOutlet
  ],
  templateUrl: './ecmr-table.component.html',
  styleUrl: './ecmr-table.component.scss'
})
export class EcmrTableComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate'];
  columns: string[] = ['id', 'referenceId', 'from', 'to', 'transportType', 'lastEditor', 'status', 'lastEditDate', 'creationDate'];
  filteredColumns: string[] = [];

  dataSource: MatTableDataSource<EcmrData> = new MatTableDataSource<EcmrData>();

  // toggle for filter selection
  showColumSelection: boolean = false;
  showFilter: boolean = false;

  // toggle for display of columns
  showRefId: boolean = true;
  showFrom: boolean = true;
  showTo: boolean = true;
  showTransportType: boolean = true;
  showLastEditor: boolean = true;
  showStatus: boolean = true;
  showLastEditDate: boolean = true;
  showCreationDate: boolean = true;

  // ecmr selected
  selectedEcmr: EcmrData | undefined;

  showDetails: boolean = false;
  @Input() quickViewButtons: TemplateRef<object>;
  @Input() actionButtons: TemplateRef<object>;

  toggledColumns = [this.showRefId, this.showFrom, this.showTo, this.showTransportType, this.showLastEditor, this.showStatus, this.showLastEditDate, this.showCreationDate];

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, public snackbar: MatSnackBar) {
  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  showDetailsForEcmrAtIndex(index: number) {
    this.selectedEcmr = this.dataSource.data[index];
    this.showDetails = true;
  }

  closeDetailsView() {
    this.showDetails = false;
  }

  sortData(sort: Sort){
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

  tableDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex+1, event.currentIndex+1);
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
    console.log("filter status: " + this.showColumSelection);
  }

  toggleColumnAtIndex(index: number) {
    return this.toggledColumns[index] = !this.toggledColumns[index];
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
    console.log(JSON.stringify(this.toggledColumns));
    this.filteredColumns = [];
    this.filteredColumns.push(this.displayedColumns[0]);
    for (let i = 0; i < this.columns.length - 1; i++) {
      if (this.toggledColumns[i]) {
        this.filteredColumns.push(this.columns[i + 1]);
      }
    }

    // keep order of columns
    this.displayedColumns = this.displayedColumns.filter(item => this.filteredColumns.includes(item));
    // add columns that were hidden before at their original position
    const newColumns = this.filteredColumns.filter(item => !this.displayedColumns.includes(item));
    for(const item of newColumns) {
      const originalPos = this.columns.indexOf(item)
      const length = this.displayedColumns.push(item);
      const newPos = originalPos >= length ? length-1 : originalPos;
      moveItemInArray(this.displayedColumns, length, newPos)
    }

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

  // TODO: implement History-function for eCMR
  historyOfEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  // TODO: implement Guest Access-function for eCMR
  guestAccessToEcmr() {
    this.snackbar.open('Not implemented yet.', '', {duration: 3000});
  }

  protected readonly JSON = JSON;
}

function compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
  if(a && b){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  return 0
}
