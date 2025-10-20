/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoryLog } from '../../../../../core/models/HistoryLog';
import { environment } from '../../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HistoryLogsService {
    private http = inject(HttpClient);


    getHistoryLogs(ecmrId: string) {
        return this.http.get<HistoryLog[]>(`${environment.backendUrl}/history/${ecmrId}`)
    }
}
