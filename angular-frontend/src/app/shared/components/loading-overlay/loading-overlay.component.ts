/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-loading-overlay',
    imports: [
        NgClass
    ],
    templateUrl: './loading-overlay.component.html',
    styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent implements OnChanges {
    readonly loading = input<boolean | null>(false);
    showSpinner: boolean = false;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['loading']) {
            if (this.loading()) {
                setTimeout(() => this.showSpinner = true, 0);
            } else {
                this.showSpinner = false;
            }
        }
    }
}
