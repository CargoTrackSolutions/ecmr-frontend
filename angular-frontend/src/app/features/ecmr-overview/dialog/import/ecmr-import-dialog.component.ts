/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { EcmrService } from '../../../../shared/services/ecmr.service';
import { catchError, of } from 'rxjs';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TranslateModule } from '@ngx-translate/core';

interface DialogData {
}

/**
 * @license
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */
@Component({
  selector: 'app-ecmr-import-dialog.component',
  templateUrl: 'ecmr-import-dialog.component.html',
    styleUrl: './ecmr-import-dialog.component.scss',
  standalone: true,
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatLabel, MatDialogClose, ZXingScannerModule, NgIf, MatFormField, MatInput, ReactiveFormsModule, MatSelect, MatOption, NgForOf, MatIconButton, MatIcon, MatSuffix, MatTooltip, NgClass, TranslateModule],
})
export class EcmrImportDialogComponent {

    @ViewChild('scanner', {static: false})
    scanner: ZXingScannerComponent;

    allowedFormats = [BarcodeFormat.QR_CODE];

    cameras: MediaDeviceInfo[] = [];
    selectedCameraIndex: number = 0;
    selectedCamera: MediaDeviceInfo;
    cameraActive = false;

    cameraResolution: string;
    cameraAspectRatio: string;
    cameraCssClass: string;

    tokenFormControl = new FormControl<string>('', [Validators.required]);

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
                private snackbarService: SnackbarService,
                private matDialogRef: MatDialogRef<EcmrImportDialogComponent>,
                private ecmrService: EcmrService) {
    }

    handleQrCodeResult(resultString: string) {
        console.log('QR-Code-Ergebnis:', resultString);
        this.tokenFormControl.setValue(resultString);
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            this.tokenFormControl.setValue(text);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    onCamerasFound(devices: MediaDeviceInfo[]): void {
        this.cameras = devices;
        if (this.cameras.length > 0 && this.selectedCameraIndex === null) {
            this.selectedCameraIndex = 0;
        }
        this.getCameraResolution().then(() => {
            this.selectedCamera = this.cameras[this.selectedCameraIndex];
        });
    }

    toggleCamera() {
        this.cameraActive = !this.cameraActive;
    }

    switchCamera() {
        if (this.cameras.length > 0) {
            this.selectedCameraIndex = (this.selectedCameraIndex + 1) % this.cameras.length;
            this.getCameraResolution().then(() => {
                this.selectedCamera = this.cameras[this.selectedCameraIndex];
            });
        }
    }

    async getCameraResolution() {
        try {
            if (this.selectedCamera) {
                const stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: {exact: this.selectedCamera.deviceId}}});
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();

                this.cameraResolution = `${settings.width} x ${settings.height}`;
                if (settings.width && settings.height) {
                    this.cameraAspectRatio = (settings.width / settings.height).toFixed(2);
                    this.updateCameraCssClass();
                }
                track.stop();
            }
        } catch (error) {
            console.error('Error accessing camera', error);
            this.cameraResolution = 'Unable to access camera';
            this.cameraAspectRatio = 'N/A';
        }
    }

    updateCameraCssClass() {
        if (this.cameraAspectRatio) {
            if (parseFloat(this.cameraAspectRatio) > 1) {
                this.cameraCssClass = 'landscape';
            } else {
                this.cameraCssClass = 'portrait';
            }
        } else {
            this.cameraCssClass = '';
        }
    }

    importEcmr() {
        if (this.tokenFormControl.valid && this.tokenFormControl.value) {
            this.ecmrService.importEcmr(this.tokenFormControl.value).pipe(
                catchError(() => {
                    this.snackbarService.openErrorSnackbar('error.ecmr_not_found')
                    return of(null)
                })
            ).subscribe(result => {
                if (result) {
                    this.matDialogRef.close(result)
                }
            })
        }
    }

    close() {
        this.matDialogRef.close()
    }
}
