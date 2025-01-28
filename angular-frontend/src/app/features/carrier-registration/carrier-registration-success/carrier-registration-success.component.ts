/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { MatError, MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { NgForOf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ExternalUserService } from '../../ecmr-editor/ecmr-editor-service/external-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-carrier-registration-success',
    standalone: true,
    imports: [
        MatInput,
        NgForOf,
        FormsModule,
        MatFormField,
        MatButton,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatError,
        MatIcon,
        MatLabel,
        MatPrefix,
        ReactiveFormsModule,
        TranslateModule
    ],
    templateUrl: './carrier-registration-success.component.html',
    styleUrl: './carrier-registration-success.component.scss'
})
export class CarrierRegistrationSuccessComponent implements AfterViewInit {

    carrierTan = new FormControl<string>('', Validators.required);

    ecmrId: string;
    userToken: string;
    sub: Subscription;

    constructor(private ecmrTanService: ExternalUserService,
                private router: Router,
                private route: ActivatedRoute,
                private readonly changeDetectorRef: ChangeDetectorRef,) {
        this.sub = this.route.params.subscribe(params => {
            this.ecmrId = params['id'];
            this.userToken = params['userToken'];
        });
    }

    @ViewChild("focusedInput") focusedInputField: ElementRef;
    ngAfterViewInit() {
        this.focusedInputField.nativeElement.focus();
        this.changeDetectorRef.detectChanges();
    }

    authenticate() {
        const tan = this.carrierTan.value;
        if (this.carrierTan.valid && this.ecmrId && tan && this.userToken) {
            this.ecmrTanService.isTanValid(this.ecmrId, this.userToken, tan).subscribe(res => {
                if (res) {
                    this.router.navigateByUrl(`/ecmr-tan/${this.ecmrId}/${this.userToken}/${tan}`)
                }
            })
        }
    }
}
