/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EcmrStatus } from '../../../../core/models/EcmrStatus';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-ecmr-status-ring',
    standalone: true,
    imports: [
        MatIcon,
        NgClass
    ],
    templateUrl: './ecmr-status-ring.component.html',
    styleUrl: './ecmr-status-ring.component.scss'
})
export class EcmrStatusRingComponent {

    @Input() icon: string;
    @Input() status: EcmrStatus | undefined;
    protected readonly EcmrStatus = EcmrStatus;

    isActive(status: EcmrStatus) {
        const statusHierarchy = [
            EcmrStatus.NEW,
            EcmrStatus.LOADING,
            EcmrStatus.IN_TRANSPORT,
            EcmrStatus.ARRIVED_AT_DESTINATION
        ];
        if (this.status) {
            const currentStatusIndex = statusHierarchy.indexOf(this.status);
            const checkStatusIndex = statusHierarchy.indexOf(status);
            return checkStatusIndex <= currentStatusIndex;
        } else {
            return false;
        }
    }
}
