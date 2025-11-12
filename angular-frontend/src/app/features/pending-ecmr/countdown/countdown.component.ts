/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component } from '@angular/core';
import { interval, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatChip, MatChipAvatar } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-countdown',
    imports: [
        AsyncPipe,
        MatChip,
        MatIcon,
        MatChipAvatar
    ],
    templateUrl: './countdown.component.html',
    styleUrl: './countdown.component.scss'
})
export class CountdownComponent {

    countdown$ = interval(1000).pipe(
        startWith(0),
        map(() => this.getTimeToNextFiveMinuteMark())
    );

    private getTimeToNextFiveMinuteMark(): string {
        const now = new Date();
        const minutes = now.getMinutes();
        const nextMarkMinute = Math.ceil((minutes + 1) / 5) * 5;

        const nextMark = new Date(now);
        nextMark.setSeconds(0);
        nextMark.setMilliseconds(0);

        if (nextMarkMinute === 60) {
            nextMark.setHours(now.getHours() + 1);
            nextMark.setMinutes(0);
        } else {
            nextMark.setMinutes(nextMarkMinute);
        }

        const diffMs = nextMark.getTime() - now.getTime();
        const diffSec = Math.floor(diffMs / 1000);

        const minutesLeft = Math.floor(diffSec / 60);
        const secondsLeft = diffSec % 60;

        return `${this.pad(minutesLeft)}:${this.pad(secondsLeft)}`;
    }

    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

}
