/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Location } from '../../../core/models/Location';
import { LocationService } from '../location-service/location.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';
import { CountryCode } from '../../../core/enums/CountryCode';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

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
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatLabel,
        MatCardModule,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        AsyncPipe,
        NgForOf,
        NgIf,
        MatError
    ],
    templateUrl: './location-edit-dialog.component.html',
    styleUrl: './location-edit-dialog.component.scss'
})
export class LocationEditDialogComponent implements OnInit {

    isEdit: boolean = false;
    location: Location;
    initialFormValues: any;

    locationEditFormGroup = new FormGroup({
        name: new FormControl<string>('', Validators.required),
        street: new FormControl<string>('', Validators.required),
        postcode: new FormControl<string>('', Validators.required),
        city: new FormControl<string>('', Validators.required),
        countryCode: new FormControl('', [Validators.required, countryCodeValidator()]),
        officeNumber: new FormControl<string>(''),
    });

    countryCodes = Object.keys(CountryCode).map(key => ({
        code: key
    }));
    filteredOptions: Observable<{ code: string }[]>;

    constructor(@Inject(MAT_DIALOG_DATA) readonly data: Location | null, public dialogRef: MatDialogRef<LocationEditDialogComponent>, private locationService: LocationService, private snackBarService: SnackbarService) {
    }

    ngOnInit(): void {
        if (this.data) {
            this.location = this.data;
            this.locationEditFormGroup.patchValue(this.location);
            this.locationEditFormGroup.controls.countryCode.disable();
            this.isEdit = true;
            this.initialFormValues = this.locationEditFormGroup.value;
        }

        this.filteredOptions = this.locationEditFormGroup.controls.countryCode.valueChanges
            .pipe(
                startWith(''),
                map(value => this.countryAutocompleteFilter(value || ''))
            );
    }

    saveLocation() {
        if (this.locationEditFormGroup.valid) {
            const location: Location = {
                id: this.location ? this.location!.id : null,
                name: this.locationEditFormGroup.controls.name.value!,
                street: this.locationEditFormGroup.controls.street.value!,
                postcode: this.locationEditFormGroup.controls.postcode.value!,
                city: this.locationEditFormGroup.controls.city.value!,
                countryCode: this.location ? this.location!.countryCode : this.locationEditFormGroup.controls.countryCode.value as CountryCode,
                officeNumber: this.locationEditFormGroup.controls.officeNumber.value
            }

            if (!this.isEdit) {
                this.locationService.createLocation(location).subscribe({
                    next: () => {
                        this.snackBarService.openSuccessSnackbar('location.success.created', 3000);
                        this.dialogRef.close(location);
                    },
                    error: err => {
                        if (err) {
                            this.snackBarService.openErrorSnackbar('location.error.not_created', 3000);
                        }
                    }
                })
            } else {
                this.locationService.updateLocation(location).subscribe({
                    next: () => {
                        this.snackBarService.openSuccessSnackbar('location.success.updated', 3000);
                        this.dialogRef.close(location);
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

    private countryAutocompleteFilter(value: string): { code: string }[] {
        const filterValue = value.toLowerCase();
        return this.countryCodes.filter(option =>
            option.code.toLowerCase().includes(filterValue)
        );
    }

    closeDialog() {
        this.dialogRef.close();
    }

    hasChanges(): boolean {
        return JSON.stringify(this.initialFormValues) !== JSON.stringify(this.locationEditFormGroup.value);
    }
}

export function countryCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const validCodes = Object.keys(CountryCode);
        const value = control.value;
        return validCodes.includes(value) ? null : { invalidCountryCode: { value } };
    };
}