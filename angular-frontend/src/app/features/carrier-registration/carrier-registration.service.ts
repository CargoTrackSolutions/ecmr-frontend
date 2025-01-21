/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { Registration } from '../../core/models/Registration';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SharedCarrierInformation } from '../../core/models/SharedCarrierInformation';

@Injectable({
    providedIn: 'root'
})
export class CarrierRegistrationService {

    constructor(private http: HttpClient, handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getEcmrCarrierInfo(ecmrId: string, shareToken: string) {
        return this.http.get<SharedCarrierInformation>(`${environment.backendUrl}/anonymous/ecmr-carrier/${ecmrId}/${shareToken}`)
    }

    sendRegistration(registration: Registration) {
        return this.http.post<void>(environment.backendUrl + '/anonymous/registration', registration)
    }
}
