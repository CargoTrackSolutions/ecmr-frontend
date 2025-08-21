/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subscription, switchMap, takeWhile, tap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Registration } from '../../core/models/Registration';
import { ExternalUserRegistrationService } from './external-user-registration.service';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { LoadingService } from '../../core/services/loading.service';

@Component({
    selector: 'app-external-user-registration',
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
    templateUrl: './external-user-registration.component.html',
    styleUrl: './external-user-registration.component.scss'
})
export class ExternalUserRegistrationComponent {

    sub: Subscription;
    ecmrId: string;
    ecmrToken: string;
    roleToShare: EcmrRole;

    externalUser = new FormGroup({
        firstName: new FormControl<string>('', [Validators.required]),
        lastName: new FormControl<string>('', [Validators.required]),
        phone: new FormControl<string>('', [Validators.required, Validators.pattern(/^\+?[0-9\s\-().]{7,20}$/)]),
        company: new FormControl<string>('', [Validators.required]),
    })

    constructor(private route: ActivatedRoute,
                private externalUserRegistrationService: ExternalUserRegistrationService,
                private router: Router,
                authService: AuthService,
                private snackBarService: SnackbarService,
                private readonly loadingService: LoadingService) {
        authService.getAuthenticatedUser().pipe(takeWhile(user => !user, true))
            .subscribe(user => {
                if (user) {
                    snackBarService.openInfoSnackbar('external_user_registration.registered_user');
                    this.router.navigateByUrl('/ecmr-overview');
                }
            });

        this.sub = this.route.params
            .pipe(
                tap(params => {
                    this.ecmrId = params['id'];
                }),
                switchMap(() => this.route.queryParams),
                tap(queryParams => {
                    this.ecmrToken = queryParams['token'];
                    this.roleToShare = queryParams['role'];
                }),
                filter(() => this.roleToShare != EcmrRole.Reader),
                switchMap(() => this.externalUserRegistrationService.getExternalUserRegistrationInfo(this.ecmrId, this.ecmrToken))
            )
            .subscribe({
                next: sharedInfo => {
                    this.externalUser.controls.company.setValue(sharedInfo.companyName);
                    if(this.roleToShare == EcmrRole.Carrier) {
                        const driverFirstName = sharedInfo.driverName?.substring(0, sharedInfo.driverName.indexOf(" ")) || null;
                        const driverLastName = sharedInfo.driverName?.substring(sharedInfo.driverName.indexOf(" ")) || null;
                        this.externalUser.controls.firstName.setValue(driverFirstName);
                        this.externalUser.controls.lastName.setValue(driverLastName);
                    }
                },
                error: () => {
                    this.snackBarService.openErrorSnackbar('general.snackbar_error');
                }
            });
    }

    sendRegistration() {
        if (this.externalUser.valid && this.ecmrId && this.ecmrToken) {
            const registration: Registration = {
                firstName: this.externalUser.controls.firstName.value!,
                lastName: this.externalUser.controls.lastName.value!,
                phone: this.externalUser.controls.phone.value!,
                company: this.externalUser.controls.company.value!,
                email: null,
                ecmrId: this.ecmrId,
                shareToken: this.ecmrToken
            }

            this.loadingService.showLoaderUntilCompleted(this.externalUserRegistrationService.sendRegistration(registration)).subscribe({
                next: (registrationResponse) => {
                    this.router.navigate(['/external-user-registration-success', this.ecmrId], {queryParams: {token: registrationResponse.userToken}});
                },
                error: (err) => {
                    if(err.status == 429) {
                        this.snackBarService.openInfoSnackbar('external_user_registration.too_many_requests');
                    }
                    console.log(err);
                }
            })
        }

    }

}
