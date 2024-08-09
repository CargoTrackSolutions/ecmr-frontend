/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Input, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '../../../core/models/Location';
import { LocationService } from '../location-service/location.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-location-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        TranslateModule,
        MatDialogActions,
        MatIcon,
        ReactiveFormsModule,
        MatFormField,
        MatButton,
        MatInput,
        MatLabel,
        MatCardModule,
        MatCardHeader,
        MatCardContent
    ],
    templateUrl: './location-edit-dialog.component.html',
    styleUrl: './location-edit-dialog.component.scss'
})
export class LocationEditDialogComponent implements OnInit {

    @Input() location: Location | null;
    isEdit: boolean = false;

    locationEditFormGroup = new FormGroup({
        name: new FormControl<string>('', Validators.required),
        street: new FormControl<string>('', Validators.required),
        postcode: new FormControl<string>('', Validators.required),
        city: new FormControl<string>('', Validators.required),
        countryCode: new FormControl<string>('', Validators.required),
        officeNumber: new FormControl<string>(''),
    });

    constructor(public dialogRef: MatDialogRef<LocationEditDialogComponent>, private locationService: LocationService, private snackBarService: SnackbarService) {
    }

    ngOnInit(): void {
        if (this.location) {
            this.locationEditFormGroup.patchValue(this.location);
            this.isEdit = true;
        }
    }

    saveLocation() {
        if (this.locationEditFormGroup.valid) {
            if (!this.isEdit) {
                this.locationService.createLocation();
            } else {
                const locationToUpdate: Location = {
                    id: this.location!.id,
                    name: this.locationEditFormGroup.controls.name.value!,
                    street: this.locationEditFormGroup.controls.street.value!,
                    postcode: this.locationEditFormGroup.controls.postcode.value!,
                    city: this.locationEditFormGroup.controls.city.value!,
                    countryCode: this.location!.countryCode,
                    officeNumber: this.locationEditFormGroup.controls.officeNumber.value
                }

                this.locationService.updateLocation(locationToUpdate).subscribe({
                    next: updatedLocation => {
                        this.snackBarService.openSuccessSnackbar('location.success.updated',3000);
                        this.dialogRef.close(updatedLocation);
                    },
                    error: err => {
                        if (err.error.status === 404) {
                            this.snackBarService.openErrorSnackbar('location.error.not_found', 3000);
                        }
                    }
                })
            }
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
