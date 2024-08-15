/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

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

    externalCarrier = new FormGroup({
        firstName: new FormControl<string>('', [Validators.required]),
        lastName: new FormControl<string>('', [Validators.required]),
        phone: new FormControl<string>('', [Validators.required]),
        company: new FormControl<string>('', [Validators.required]),
    })

    constructor(private route: ActivatedRoute) {
        this.sub = this.route.params.subscribe(params => {
            this.ecmrId = params['id'];
        });
    }
}
