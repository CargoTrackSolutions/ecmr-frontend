/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HistoryLogsService } from './history-logs-service/history-logs.service';

import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { DateTimeService } from '../../../../shared/services/date-time.service';
import { HistoryLog } from '../../../../core/models/HistoryLog';
import { LoadingService } from '../../../../core/services/loading.service';
import { ActionType } from '../../../../core/enums/ActionType';


@Component({
    selector: 'app-history-logs',
    imports: [
        TranslateModule,
        MatIcon
    ],
    providers: [DatePipe, DateTimeService],
    templateUrl: './history-logs.component.html',
    styleUrl: './history-logs.component.scss'
})
export class HistoryLogsComponent implements OnInit {
    private loadingService = inject(LoadingService);
    protected dateTimeService = inject(DateTimeService);
    private historyLogService = inject(HistoryLogsService);



    historyLogs: HistoryLog[] = [];
    readonly ecmrId = input<string>('');
    readonly referenceId = input<string>('');

    ngOnInit(): void {
        this.loadingService.showLoaderUntilCompleted(this.historyLogService.getHistoryLogs(this.ecmrId())).subscribe(historyLogs => {
            this.historyLogs = historyLogs;
        })
    }

    protected readonly ActionType = ActionType;
}
