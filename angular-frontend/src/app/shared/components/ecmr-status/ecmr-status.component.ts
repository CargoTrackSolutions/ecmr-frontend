/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, input } from '@angular/core';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { EcmrStatusRingComponent } from './ecmr-status-ring/ecmr-status-ring.component';

@Component({
    selector: 'app-ecmr-status',
    imports: [
        MatTooltip,
        TranslateModule,
        EcmrStatusRingComponent
    ],
    templateUrl: './ecmr-status.component.html',
    styleUrl: './ecmr-status.component.scss'
})
export class EcmrStatusComponent {

    readonly status = input<EcmrStatus>();
    readonly isMobile = input<boolean>();
    protected readonly EcmrStatus = EcmrStatus;

    getIcon() {
        const status = this.status();
        if (status === EcmrStatus.NEW) return 'fiber_new'
        else if (status === EcmrStatus.LOADING) return 'forklift'
        else if (status === EcmrStatus.IN_TRANSPORT) return 'local_shipping'
        else if (status === EcmrStatus.DELIVERED) return 'where_to_vote'
        return '';
    }
}
