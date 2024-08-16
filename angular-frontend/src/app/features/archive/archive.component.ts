/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EcmrService } from '../../shared/services/ecmr.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { EMPTY, switchMap } from 'rxjs';
import { EcmrOverviewDetailsComponent } from '../ecmr-overview/ecmr-overview-details/ecmr-overview-details.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Ecmr } from '../../core/models/Ecmr';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    EcmrTableComponent,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    MatToolbar,
    MatToolbarRow,
    TranslateModule,
    EcmrOverviewDetailsComponent,
    MatDrawer,
    MatDrawerContainer
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit {
  @ViewChild(EcmrTableComponent) table: EcmrTableComponent;

  selectedEcmr: Ecmr | null = null;

  constructor(public dialog: MatDialog, public snackbar: MatSnackBar, public ecmrService: EcmrService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.loadData()
    console.log(this.selectedEcmr);
  }

  loadData() {
    this.ecmrService.getAllArchivedEcmr().subscribe(data => {
      this.table.dataSource = new MatTableDataSource(data);
    })
  }

  moveToOverview(ecmrId: string) {
    const confirmationMessage = this.translateService.instant('archive.confirmation_message');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {text: confirmationMessage}
    })

    dialogRef.afterClosed().pipe(
      switchMap(result =>{
        if(result.isConfirmed){
          return this.ecmrService.moveOutOfArchive(ecmrId);
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

  selectEcmr(ecmr: Ecmr | null) {
    this.selectedEcmr = ecmr;
  }

  closeDetailView($event: boolean) {
    if ($event)
      this.selectEcmr(null)
  }
}
