/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../core/services/loading.service';
import { DateTimeService } from '../../shared/services/date-time.service';
import { HistoryLogsService } from './history-logs-service/history-logs.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { HistoryLog } from '../../core/models/HistoryLog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgForOf } from '@angular/common';

@Component({
    selector: 'app-history-logs',
    standalone: true,
    imports: [
        MatCard,
        MatCardTitle,
        TranslateModule,
        MatCardContent,
        MatButton,
        MatIcon,
        MatCardHeader,
        NgForOf
    ],
    providers: [DatePipe, DateTimeService],
    templateUrl: './history-logs.component.html',
    styleUrl: './history-logs.component.scss'
})
export class HistoryLogsComponent implements OnInit {

    historyLogs: HistoryLog[] = [];
    ecmrId: string = '';
    referenceId: string = '';

    constructor(private translateService: TranslateService,
                private loadingService: LoadingService,
                protected dateTimeService: DateTimeService,
                private route: ActivatedRoute,
                private historyLogService: HistoryLogsService,
                private router: Router,
                ) {
    }

    ngOnInit(): void {
        this.ecmrId = this.route.snapshot.params['id'];
        this.referenceId = this.route.snapshot.params['refId'];

        this.loadingService.showLoaderUntilCompleted(this.historyLogService.getHistoryLogs(this.ecmrId)).subscribe(historyLogs => {
            this.historyLogs = historyLogs;
        })
    }

    back() {
        this.router.navigateByUrl(`/ecmr-overview`);
    }
}
