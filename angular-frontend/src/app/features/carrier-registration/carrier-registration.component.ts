/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeWhile } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Registration } from '../../core/models/Registration';
import { CarrierRegistrationService } from './carrier-registration.service';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
    selector: 'app-carrier-registration',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIcon,
        MatInput,
        ReactiveFormsModule,
        TranslateModule,
        MatCardModule,
        MatCardHeader,
        MatButton,
    ],
    templateUrl: './carrier-registration.component.html',
    styleUrl: './carrier-registration.component.scss'
})
export class CarrierRegistrationComponent {

    sub: Subscription;
    ecmrId: string;
    ecmrToken: string;

    externalCarrier = new FormGroup({
        firstName: new FormControl<string>('', [Validators.required]),
        lastName: new FormControl<string>('', [Validators.required]),
        phone: new FormControl<string>('', [Validators.required, Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)]),
        company: new FormControl<string>('', [Validators.required]),
    })

    constructor(private route: ActivatedRoute,
                private carrierRegistrationService: CarrierRegistrationService,
                private router: Router,
                authService: AuthService,
                private snackBarService: SnackbarService) {
        authService.getAuthenticatedUser().pipe(takeWhile(user => !user, true))
            .subscribe(user => {
                if (user) {
                    snackBarService.openInfoSnackbar('carrier_registration.registered_user');
                    this.router.navigateByUrl('/ecmr-overview');
                }
            });

        this.sub = this.route.params.subscribe(params => {
            this.ecmrId = params['id'];
            this.ecmrToken = params['token'];
        });
        
        this.carrierRegistrationService.getEcmrCarrierInfo(this.ecmrId, this.ecmrToken).subscribe({
            next: carrierInfo => {
                this.externalCarrier.controls.company.setValue(carrierInfo.carrierNameCompany);
                const carrierName = carrierInfo.carrierNamePerson;
                const carrierFirstName = carrierName?.substring(0, carrierName.indexOf(" ")) || null;
                const carrierLastName = carrierName?.substring(carrierName.indexOf(" ")) || null;
                this.externalCarrier.controls.firstName.setValue(carrierFirstName);
                this.externalCarrier.controls.lastName.setValue(carrierLastName);
            },
            error: () => {
            }
        });
        
    }

    sendRegistration() {
        if (this.externalCarrier.valid && this.ecmrId && this.ecmrToken) {
            const registration: Registration = {
                firstName: this.externalCarrier.controls.firstName.value!,
                lastName: this.externalCarrier.controls.lastName.value!,
                phone: this.externalCarrier.controls.phone.value!,
                company: this.externalCarrier.controls.company.value!,
                email: null,
                ecmrId: this.ecmrId,
                shareToken: this.ecmrToken
            }

            this.carrierRegistrationService.sendRegistration(registration).subscribe({
                next: () => {
                    this.router.navigateByUrl(`/carrier-registration-success/${this.ecmrId}`)
                },
                error: (err) => {
                    if(err.status == 429) {
                        this.snackBarService.openInfoSnackbar('carrier_registration.too_many_requests');
                    }
                    console.log(err);
                }
            })
        }

    }

}
