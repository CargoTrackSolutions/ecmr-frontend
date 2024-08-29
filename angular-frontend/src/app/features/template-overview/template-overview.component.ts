/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButton, MatIconButton } from '@angular/material/button';
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
  MatTableDataSource
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TemplateOverviewService } from './template-overview-service/template-overview.service';
import { TemplateUser } from '../../core/models/TemplateUser';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filter, switchMap } from 'rxjs';
import { EcmrOverviewDetailsComponent } from '../ecmr-overview/ecmr-overview-details/ecmr-overview-details.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-template-overview',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    MatButton,
    MatCard,
    MatCardContent,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatDivider,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatSuffix,
    MatTable,
    MatToolbar,
    MatToolbarRow,
    MatTooltip,
    NgIf,
    TranslateModule,
    MatHeaderCellDef,
    EcmrOverviewDetailsComponent,
    MatDrawer,
    MatDrawerContainer,
    MatPaginator
  ],
  templateUrl: './template-overview.component.html',
  styleUrl: './template-overview.component.scss'
})
export class TemplateOverviewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'number', 'name', 'refId', 'from', 'to'];
  columns: string[] = ['id', 'number', 'name', 'refId', 'from', 'to'];
  filteredColumns: string[] = [];

  showColumSelection: boolean = false;
  showFilter: boolean = false;

  showNumber: boolean = true;
  showName: boolean = true;
  showRefId: boolean = true;
  showFrom: boolean = true;
  showTo: boolean = true;
  toggledColumns = [this.showNumber, this.showName, this.showRefId, this.showFrom, this.showTo];

  selectedTemplate: TemplateUser | null = null;

  dataSource: MatTableDataSource<TemplateUser> = new MatTableDataSource<TemplateUser>();

  protected readonly JSON = JSON;

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, public snackbar: MatSnackBar, public overviewService: TemplateOverviewService,
              private router: Router, public templateOverviewService: TemplateOverviewService, public translateService: TranslateService) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngOnInit() {
    this.overviewService.getAllTemplates().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    })
  }

  createNewTemplate() {
    this.router.navigateByUrl('/template-editor');
  }

  editTemplate(templateUser: TemplateUser) {
    this.router.navigateByUrl(`/template-editor/${templateUser.id}`)
  }

  deleteTemplate(templateUser: TemplateUser) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: 'template_overview.delete_template_dialog_text'
      }
    }).afterClosed().pipe(
        filter(result => result.isConfirmed === true),
        switchMap(() => this.templateOverviewService.deleteTemplate(templateUser.id))
    ).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(loc => loc.id != templateUser.id);
      },
      error: () => {
      }
    });
  }

  shareTemplate() {

  }

  sortData(sort: Sort) {
    this.announceSortChange(sort);

    const data = this.dataSource.data.slice();
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'number':
          return compare(a.templateUserNumber, b.templateUserNumber, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'refId':
          return compare(a.ecmr.ecmrConsignment.referenceIdentificationNumber.value, b.ecmr.ecmrConsignment.referenceIdentificationNumber.value, isAsc);
        case 'from':
          return compare(a.ecmr.ecmrConsignment.senderInformation.senderNameCompany, b.ecmr.ecmrConsignment.senderInformation.senderNameCompany, isAsc);
        case 'to':
          return compare(a.ecmr.ecmrConsignment.consigneeInformation.consigneeNameCompany, b.ecmr.ecmrConsignment.consigneeInformation.consigneeNameCompany, isAsc);
        default:
          return 0;
      }
    });
  }

  tableDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex + 1, event.currentIndex + 1);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

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
    for (const item of newColumns) {
      const originalPos = this.columns.indexOf(item)
      const length = this.displayedColumns.push(item);
      const newPos = originalPos >= length ? length - 1 : originalPos;
      moveItemInArray(this.displayedColumns, length, newPos)
    }

    this.showColumSelection = false;

  }

  selectTemplate(templateUser: TemplateUser | null) {
    console.log(templateUser);
    this.selectedTemplate = templateUser;
  }

  closeDetailView($event: boolean) {
    if ($event)
      this.selectTemplate(null)
  }
}

function compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
  if(a && b){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  return 0
}
