/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HistoryLog } from '../../../core/models/HistoryLog';

@Injectable({
    providedIn: 'root'
})
export class HistoryLogsService {

    constructor(private http: HttpClient) {
    }

    getHistoryLogs(ecmrId: string) {
        return this.http.get<HistoryLog[]>(`${environment.backendUrl}/history/${ecmrId}`)
    }
}
