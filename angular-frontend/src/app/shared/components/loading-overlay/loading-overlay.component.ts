/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-loading-overlay',
    standalone: true,
    imports: [
        NgClass,
        NgIf
    ],
    templateUrl: './loading-overlay.component.html',
    styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent implements OnChanges {
    @Input() loading: boolean | null = false
    showSpinner: boolean = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['loading']) {
            if (this.loading) {
                setTimeout(() => this.showSpinner = true, 0);
            } else {
                this.showSpinner = false;
            }
        }
    }
}
