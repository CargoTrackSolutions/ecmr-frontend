/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateFormatService {

    constructor() {
    }

    formatDate(date: Date): string {
        if (!date) {
            return '';
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return '';
        }

        const locale = navigator.language || 'en-EN';

        return parsedDate.toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
}
