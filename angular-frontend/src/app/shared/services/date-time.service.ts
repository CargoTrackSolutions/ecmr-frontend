/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {
    private datePipe = inject(DatePipe);


    transformDate(input: any) {
        const date = new Date(input);
        return this.datePipe.transform(date, 'dd.MM.yyyy HH:mm', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    transformTime(input: any) {
        const date = new Date(input);
        return this.datePipe.transform(date, 'HH:mm', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    transformDateWithoutTime(input: any) {
        const date = new Date(input);
        return this.datePipe.transform(date, 'dd.MM.yyyy', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
}
