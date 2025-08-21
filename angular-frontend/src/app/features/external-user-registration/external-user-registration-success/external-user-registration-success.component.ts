/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ExternalUserService } from '../../ecmr-editor/ecmr-editor-service/external-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-external-user-registration-success',
    standalone: true,
    imports: [
        MatInput,
        FormsModule,
        MatFormField,
        MatButton,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatError,
        MatIcon,
        MatLabel,
        ReactiveFormsModule,
        TranslateModule
    ],
    templateUrl: './external-user-registration-success.component.html',
    styleUrl: './external-user-registration-success.component.scss'
})
export class ExternalUserRegistrationSuccessComponent implements AfterViewInit {

    carrierTan = new FormControl<string>('', Validators.required);

    ecmrId: string;
    token: string;
    sub: Subscription;

    constructor(private ecmrTanService: ExternalUserService,
                private router: Router,
                private route: ActivatedRoute,
                private readonly changeDetectorRef: ChangeDetectorRef) {
        this.sub = this.route.params.pipe(
            tap(params => {
                this.ecmrId = params['id'];
            }),
            switchMap(() => this.route.queryParams),
            tap(queryParams => {
                this.token = queryParams['token'];
            })
        ).subscribe();
    }

    @ViewChild('focusedInput') focusedInputField: ElementRef;

    ngAfterViewInit() {
        this.focusedInputField.nativeElement.focus();
        this.changeDetectorRef.detectChanges();
    }

    authenticate() {
        const tan = this.carrierTan.value;
        if (this.carrierTan.valid && this.ecmrId && tan && this.token) {
            this.ecmrTanService.isTanValid(this.ecmrId, this.token, tan).subscribe(res => {
                if (res) {
                    this.router.navigateByUrl(`/ecmr-tan/${this.ecmrId}/${this.token}/${tan}`)
                }
            })
        }
    }
}
