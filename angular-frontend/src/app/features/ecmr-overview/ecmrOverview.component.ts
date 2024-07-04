/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
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
} from "@angular/material/table";
import {MatTabBody, MatTabHeader} from "@angular/material/tabs";
import {MatInput} from "@angular/material/input";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption, MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatDialog, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {EcmrImportDialogComponent} from "./dialog/import/ecmr-import-dialog.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {CdkScrollable} from "@angular/cdk/overlay";
import {MatDivider} from "@angular/material/divider";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from '@angular/router';
import {EcmrTableComponent} from "../../shared/components/ecmr-table/ecmr-table.component";
import {EcmrService} from "../../shared/services/ecmr.service";
import {ConfirmationDialogComponent} from "../../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import {EMPTY, switchMap} from "rxjs";

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
  ],
  templateUrl: './ecmrOverview.component.html',
  styleUrl: './ecmrOverview.component.scss'
})
export class EcmrOverviewComponent implements OnInit {
  @ViewChild(EcmrTableComponent) table: EcmrTableComponent;

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar, private router: Router, public ecmrService: EcmrService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.ecmrService.getAllEcmr().subscribe(data => {
      this.table.dataSource = new MatTableDataSource(data);
    })
  }

  createNewEcmr() {
    this.router.navigateByUrl('/ecmr-editor');
  }

  // TODO: implement Import-function for eCMR
  importEcmr() {
    this.dialog.open(EcmrImportDialogComponent);
  }

  editEcmr(ecmrId: string) {
    if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}`);
  }

  // TODO: implement
  deleteEcmr(ecmrId: string){
  }

  moveToArchive(ecmrId: string) {
    const confirmationMessage = this.translateService.instant('overview.confirmation_message');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {text: confirmationMessage}
    })

    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if(result) {
          return this.ecmrService.moveToArchive(ecmrId);
        } else {
          return EMPTY;
        }
      })
    ).subscribe({
      next: () => {
        this.loadData();
        this.table.closeDetailsView();
      },
      error: err => {
        const action = this.translateService.instant('general.snackbar_action');
        const message = this.translateService.instant('general.snackbar_error');
        this.snackbar.open(message, action, {duration: 3000});
        console.log(err);
      }
    });
  }

}
