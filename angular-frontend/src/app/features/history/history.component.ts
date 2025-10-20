/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { EcmrAccessComponent } from './ecmr-access/ecmr-access.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Location } from '@angular/common';
import { HistoryLogsComponent } from './history/history-logs/history-logs.component';

@Component({
    selector: 'app-history',
    imports: [
        MatTabGroup,
        MatTab,
        HistoryLogsComponent,
        EcmrAccessComponent,
        TranslatePipe,
        MatButton,
        MatIcon,
        MatToolbar,
        HistoryLogsComponent
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss'
})
export class HistoryComponent {
    private _location = inject(Location);


    ecmrId: string = '';
    referenceId: string = '';

    headerTextKey: string = 'history.log.title';

    constructor() {
        const route = inject(ActivatedRoute);

        this.ecmrId = route.snapshot.params['id'];
        this.referenceId = route.snapshot.params['refId'];
    }

    back() {
        this._location.back();
    }

    onTabChange(index: number) {
        const headerTextKeys: string[] = ['history.log.title', 'history.access.title'];
        this.headerTextKey = headerTextKeys[index];
    }
}
