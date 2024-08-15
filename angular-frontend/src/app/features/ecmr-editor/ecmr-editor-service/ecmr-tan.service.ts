/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Ecmr } from '../../../core/models/Ecmr';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EcmrTanService {

    constructor(private http: HttpClient, handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getEcmrWithTan(ecmrId: string, tan: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}/external`, {params: {'tan': tan}});
    }
}
