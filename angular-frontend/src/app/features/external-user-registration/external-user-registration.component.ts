/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, DestroyRef, inject, input, InputSignal, model, ModelSignal, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { switchMap } from 'rxjs';
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
import { PhoneValidatorService } from '../../shared/services/phone-format.service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthenticatedUser } from '../../core/models/AuthenticatedUser';
import { ExternalUserInformation } from '../../core/models/ExternalUserInformation';
import { MatDialogRef } from '@angular/material/dialog';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';

@Component({
    selector: 'app-external-user-registration',
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
export class ExternalUserRegistrationComponent implements OnInit {

    private readonly authService: AuthService = inject(AuthService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly externalUserRegistrationService: ExternalUserRegistrationService = inject(ExternalUserRegistrationService);
    private readonly router: Router = inject(Router);
    private readonly snackBarService: SnackbarService = inject(SnackbarService);
    private readonly loadingService: LoadingService = inject(LoadingService);
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    ecmrId: ModelSignal<string> = model<string>('');
    ecmrToken: ModelSignal<string> = model<string>('');
    roleToShare: ModelSignal<EcmrRole | null> = model<EcmrRole | null>(null);
    dialogRef: InputSignal<MatDialogRef<ShareEcmrDialogComponent> | null> = input<MatDialogRef<ShareEcmrDialogComponent> | null>(null);

    authenticatedUser: Signal<AuthenticatedUser | null> = toSignal<AuthenticatedUser | null>(this.authService.getAuthenticatedUser(), {initialValue: null})

    externalUser = new FormGroup({
        firstName: new FormControl<string>('', [Validators.required]),
        lastName: new FormControl<string>('', [Validators.required]),
        phone: new FormControl<string>('', [Validators.required, PhoneValidatorService.phoneNumberValidator()]),
        company: new FormControl<string>('', [Validators.required]),
    })

    tokenChange$ = toObservable(this.ecmrToken)

    constructor() {
        if (this.router.url.includes('/external-user-registration') && this.authenticatedUser() != null) {
            this.snackBarService.openInfoSnackbar('external_user_registration.registered_user');
            void this.router.navigateByUrl('/ecmr-overview');
        }

        this.tokenChange$.pipe(
            switchMap(() => this.loadingService.showLoaderUntilCompleted(this.externalUserRegistrationService.getExternalUserRegistrationInfo(this.ecmrId(), this.ecmrToken()))),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((externalUserInformation: ExternalUserInformation): void => {
            this.setDataForExternalUser(externalUserInformation);
        })
    }

    ngOnInit() {
        this.getParamInformation();
        this.loadDataForExternalUser()
    }

    private getParamInformation() {
        const snapshot: ActivatedRouteSnapshot = this.route.snapshot;

        const ecmrId: string | null = snapshot.paramMap.get('id');
        if (ecmrId) this.ecmrId.set(ecmrId);

        const token: string | null = snapshot.queryParams['token']
        if (token) this.ecmrToken.set(token);

        const role: EcmrRole | null = snapshot.queryParams['role'] as EcmrRole;
        if (role) this.roleToShare.set(role);
    }

    private loadDataForExternalUser() {
        this.loadingService.showLoaderUntilCompleted(this.externalUserRegistrationService.getExternalUserRegistrationInfo(this.ecmrId(), this.ecmrToken())).subscribe((externalUserInformation: ExternalUserInformation): void => {
            this.setDataForExternalUser(externalUserInformation);
        })
    }

    private setDataForExternalUser(externalUserInformation: ExternalUserInformation) {
        this.externalUser.reset();
        this.externalUser.controls.company.setValue(externalUserInformation.companyName);
        if (this.roleToShare() === EcmrRole.Carrier) {
            const driverFirstName = externalUserInformation.driverName?.substring(0, externalUserInformation.driverName.indexOf(' ')) || null;
            const driverLastName = externalUserInformation.driverName?.substring(externalUserInformation.driverName.indexOf(' ')) || null;
            this.externalUser.controls.firstName.setValue(driverFirstName);
            this.externalUser.controls.lastName.setValue(driverLastName);
            this.externalUser.controls.phone.setValue(externalUserInformation.driverPhone);
        }
    }

    private createValidRegistrationModel(ecmrId: string, ecmrToken: string): Registration | null {
        if (this.externalUser.valid && ecmrId && ecmrToken) {
            return {
                firstName: this.externalUser.controls.firstName.value!,
                lastName: this.externalUser.controls.lastName.value!,
                phone: this.externalUser.controls.phone.value!,
                company: this.externalUser.controls.company.value!,
                email: null,
                ecmrId: ecmrId,
                shareToken: ecmrToken
            }
        } else {
            return null;
        }
    }

    protected sendRegistration(): void {
        const ecmrId = this.ecmrId();
        const ecmrToken = this.ecmrToken();

        const registrationModel = this.createValidRegistrationModel(ecmrId, ecmrToken);
        if (registrationModel) {
            this.loadingService.showLoaderUntilCompleted(
                this.externalUserRegistrationService.sendRegistration(registrationModel)
            ).subscribe({
                next: (registrationResponse) => {
                    //Close dialog if opened through share dialog
                    const dialogRef = this.dialogRef()
                    if (dialogRef != null) dialogRef.close();

                    void this.router.navigate(['/external-user-registration-success', ecmrId], {queryParams: {token: registrationResponse.userToken}});
                },
                error: (err) => {
                    if (err.status == 429) {
                        this.snackBarService.openInfoSnackbar('external_user_registration.too_many_requests');
                    }
                    console.log(err);
                }
            })
        }
    }
}
