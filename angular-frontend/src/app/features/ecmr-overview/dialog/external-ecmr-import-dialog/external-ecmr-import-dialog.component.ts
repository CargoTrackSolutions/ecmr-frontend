/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { EcmrService } from '../../../../shared/services/ecmr.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthenticatedUser } from '../../../../core/models/AuthenticatedUser';
import { TranslatePipe } from '@ngx-translate/core';
import { EcmrRole } from '../../../../core/enums/EcmrRole';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-external-ecmr-import-dialog',
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
        MatError,
        MatIcon,
        MatPrefix
    ],
    templateUrl: './external-ecmr-import-dialog.component.html',
    styleUrl: './external-ecmr-import-dialog.component.scss'
})
export class ExternalEcmrImportDialogComponent {
    private snackBarService = inject(SnackbarService);
    private loadingService = inject(LoadingService);
    private ecmrService = inject(EcmrService);
    authService = inject(AuthService);
    private matDialogRef = inject<MatDialogRef<ExternalEcmrImportDialogComponent>>(MatDialogRef);


    form: FormGroup = new FormGroup({
        url: new FormControl('', Validators.required)
    })

    ecmrId: string;
    url: string;
    token: string | null;
    role: EcmrRole | null;

    authenticatedUser: AuthenticatedUser | null;

    constructor() {
        this.authService.getAuthenticatedUser().subscribe(user => {
            this.authenticatedUser = user;
        });
    }

    submit() {
        if (this.form.valid) {
            const importUrl = this.form.controls['url'].value.trim();
            this.parseImportUrl(importUrl);
            if (!this.url || !this.ecmrId || !this.token || !this.role) {
                this.snackBarService.openErrorSnackbar('ecmr_external_import.invalid_url');
                return;
            }

            this.loadingService.showLoaderUntilCompleted(this.ecmrService.importExternalEcmr(this.url, this.ecmrId, this.token!))
                .subscribe({
                    next: () => {
                        this.snackBarService.openSuccessSnackbar('ecmr_external_import.success');
                        this.matDialogRef.close(true);
                    },
                    error: (err) => {
                        if (err.status === 409) {
                            this.snackBarService.openErrorSnackbar('ecmr_external_import.failure_409');
                        } else {
                            this.snackBarService.openErrorSnackbar('ecmr_external_import.failure');
                        }
                    }
                })
        }
    }

    parseImportUrl(inputUrl: string): void {
        const importUrl = new URL(inputUrl);

        this.url = `${importUrl.protocol}//${importUrl.host}`;

        const pathSegments = importUrl.pathname.split('/').filter(segment => segment.length > 0);
        this.ecmrId = pathSegments[pathSegments.length - 1];

        this.token = importUrl.searchParams.get('token');
        this.role = importUrl.searchParams.get('role') as EcmrRole | null;
    }


}
