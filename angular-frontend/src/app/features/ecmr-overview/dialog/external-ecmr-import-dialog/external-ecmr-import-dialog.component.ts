/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {EcmrService} from "../../../../shared/services/ecmr.service";
import {UserRole} from "../../../../core/enums/UserRole";
import {map, of, switchMap} from "rxjs";
import {
  EcmrCreateShareDialogComponent
} from "../../../ecmr-editor/ecmr-create-share-dialog/ecmr-create-share-dialog.component";
import {GroupFlat} from "../../../../core/models/GroupFlat";
import {GroupService} from "../../../group/group.service";
import {SnackbarService} from "../../../../core/services/snackbar.service";
import {LoadingService} from "../../../../core/services/loading.service";
import {AuthService} from "../../../../core/services/auth.service";
import {UserService} from "../../../../shared/services/user.service";
import {AuthenticatedUser} from "../../../../core/models/AuthenticatedUser";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-external-ecmr-import-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    TranslatePipe,
    MatDialogActions,
    MatError
  ],
  templateUrl: './external-ecmr-import-dialog.component.html',
  styleUrl: './external-ecmr-import-dialog.component.scss'
})
export class ExternalEcmrImportDialogComponent {

  form: FormGroup = new FormGroup({
    url: new FormControl('', Validators.required),
    ecmrId: new FormControl('', Validators.required),
    shareToken: new FormControl('', Validators.required),
  })

  authenticatedUser: AuthenticatedUser | null;

  constructor(private groupService: GroupService,
              private snackBarService: SnackbarService,
              private loadingService: LoadingService,
              public matDialog: MatDialog,
              private ecmrService: EcmrService,
              public authService: AuthService,
              private userService: UserService,
              private matDialogRef: MatDialogRef<ExternalEcmrImportDialogComponent>
  ) {
    this.authService.getAuthenticatedUser().subscribe(user => {
      this.authenticatedUser = user;
    });
  }

  submit() {
    if (this.form.valid) {

      (this.authenticatedUser?.user.role === UserRole.Admin ?
        this.groupService.getAllGroupsAsFlatList(true) :
        this.userService.getCurrentUserGroups())
        .pipe(
          switchMap(groups => {
            if (groups.length > 1) {
              return this.matDialog.open(EcmrCreateShareDialogComponent, {
                data: groups,
                width: '60vw',
                maxHeight: '800px'
              }).afterClosed()
            } else if (groups.length == 0) {
              return of([])
            } else {
              return of(groups)
            }
          }),
          map(groups => groups as GroupFlat[]),
          switchMap(groups => {
            return this.loadingService.showLoaderUntilCompleted(
              this.ecmrService.importExternalEcmr(this.form.controls['shareToken'].value, this.form.controls['url'].value,
                this.form.controls['ecmrId'].value, groups)
            )
          })
        ).subscribe({
        next: () => {
          this.snackBarService.openSuccessSnackbar('ecmr_external_import.success');
          this.matDialogRef.close(true);
        },
        error: () => {
          this.snackBarService.openErrorSnackbar('ecmr_external_import.failure');
        }
      })

    }
  }

}
