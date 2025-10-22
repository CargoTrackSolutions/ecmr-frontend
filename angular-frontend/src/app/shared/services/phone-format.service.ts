/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { isPossiblePhoneNumber } from 'libphonenumber-js';

import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
@Injectable({
    providedIn: 'root'
})
export class PhoneValidatorService {

    constructor() {

    }

    static phoneNumberValidator() : ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
           const valid = isPossiblePhoneNumber(control.value);
           return valid ? null : {invalidPhoneNumber: true};
        };

    }

}