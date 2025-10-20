/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-custom-snackbar',
    templateUrl: './custom-snackbar.component.html',
    imports: [
        MatIcon,
        MatProgressBar,
        TranslateModule
    ],
    styleUrl: './custom-snackbar.component.scss'
})
export class CustomSnackbarComponent {
    data = inject(MAT_SNACK_BAR_DATA);


    message: string;
    type: string;
    duration: number;
    translateValue: string;

    progress = 0;

    constructor() {
        const data = this.data;

        this.message = data.message;
        this.type = data.type;
        this.duration = data.duration;
        if (data.translateValue) this.translateValue = data.translateValue;
        this.animateProgress();
    }

    animateProgress() {
        const duration = this.duration;
        const step = 100;
        const increment = 100 / (duration / step);

        const interval = setInterval(() => {
            this.progress += increment;
            if (this.progress >= 100) {
                clearInterval(interval);
            }
        }, step);
    }
}
