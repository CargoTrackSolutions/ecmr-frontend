/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/components/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private _snackBar = inject(MatSnackBar);


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

    openErrorSnackbarWithTranslationValue(message: string, translateValue: any): void {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {message: message, type: 'error', translateValue: translateValue, duration: 3000},
            duration: 3000,
            panelClass: ['custom-snackbar', 'error']
        });
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

    openSuccessSnackbarWithTranslationValue(message: string, translateValue: any): void {
        this._snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {message: message, type: 'success', translateValue: translateValue, duration: 3000},
            duration: 3000,
            panelClass: ['custom-snackbar', 'success']
        });
    }

    openSuccessSnackbar(message: string): void {
        this.openSuccessSnackbarWithDuration(message, 3000);
    }
}
