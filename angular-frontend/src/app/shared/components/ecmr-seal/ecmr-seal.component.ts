/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { DateTimeService } from '../../services/date-time.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { SealMetadata } from '../../../core/models/SealMetadata';

@Component({
    selector: 'app-ecmr-seal',
    imports: [
        TranslatePipe,
        MatIcon,
        MatButton
    ],
    templateUrl: './ecmr-seal.component.html',
    styleUrl: './ecmr-seal.component.scss'
})
export class EcmrSealComponent {
    dateTimeService = inject(DateTimeService);

    readonly buttonDisabled = input<boolean>();
    readonly $sealMetadata = input<SealMetadata | null>();

    @Output()
    buttonClicked: EventEmitter<void> = new EventEmitter();

}
