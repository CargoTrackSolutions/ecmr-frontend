/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/components/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private _snackBar: MatSnackBar) {
    }

    openErrorSnackbarWithDuration(message: string, duration: number): void {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {message: message, type: 'error', duration: duration},
            duration: duration,
            panelClass: ['custom-snackbar', 'error']
        });
    }

    openErrorSnackbar(message: string): void {
        this.openErrorSnackbarWithDuration(message, 3000);
    }

    openInfoSnackbarWithDuration(message: string, duration: number): void {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {message: message, type: 'info', duration: duration},
            duration: duration,
            panelClass: ['custom-snackbar', 'info']
        });
    }

    openInfoSnackbar(message: string): void {
        this.openInfoSnackbarWithDuration(message, 3000);
    }

    openSuccessSnackbarWithDuration(message: string, duration: number): void {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {message: message, type: 'success', duration: duration},
            duration: duration,
            panelClass: ['custom-snackbar', 'success']
        });
    }

    openSuccessSnackbar(message: string): void {
        this.openSuccessSnackbarWithDuration(message, 3000);
    }
}
