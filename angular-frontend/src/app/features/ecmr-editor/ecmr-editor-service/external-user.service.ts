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
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExternalUserService {

    constructor(private http: HttpClient, handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getEcmrWithTan(ecmrId: string, tan: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}`, {params: {'tan': tan}});
    }

    isTanValid(ecmrId: string, tan: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/anonymous/is-tan-valid`, {params: {'ecmrId': ecmrId, 'tan': tan}});
    }

    getEcmrRolesForUser(ecmrId: string, tan: string): Observable<EcmrRole[]> {
        return this.http.get<EcmrRole[]>(`${environment.backendUrl}/anonymous/ecmr-role`, {params: {'ecmrId': ecmrId, 'tan': tan}});
    }
}
