/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EcmrStatus } from '../../../../core/models/EcmrStatus';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-ecmr-status-ring',
    imports: [
        MatIcon,
        NgClass
    ],
    templateUrl: './ecmr-status-ring.component.html',
    styleUrl: './ecmr-status-ring.component.scss'
})
export class EcmrStatusRingComponent {

    readonly icon = input<string>();
    readonly status = input<EcmrStatus>();
    protected readonly EcmrStatus = EcmrStatus;

    isActive(status: EcmrStatus) {
        const statusHierarchy = [
            EcmrStatus.NEW,
            EcmrStatus.LOADING,
            EcmrStatus.IN_TRANSPORT,
            EcmrStatus.DELIVERED
        ];
        const statusValue = this.status();
        if (statusValue) {
            const currentStatusIndex = statusHierarchy.indexOf(statusValue);
            const checkStatusIndex = statusHierarchy.indexOf(status);
            return checkStatusIndex <= currentStatusIndex;
        } else {
            return false;
        }
    }
}
