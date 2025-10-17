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
import { ExternalUserInformation } from '../../core/models/ExternalUserInformation';
import { Observable } from 'rxjs';
import { RegistrationResponse } from '../../core/models/RegistrationResponse';

@Injectable({
    providedIn: 'root'
})
export class ExternalUserRegistrationService {

    constructor(private http: HttpClient, handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getExternalUserRegistrationInfo(ecmrId: string, shareToken: string) {
        return this.http.get<ExternalUserInformation>(`${environment.backendUrl}/anonymous/registration-info/${ecmrId}`, {params: {'token': shareToken}});
    }

    sendRegistration(registration: Registration): Observable<RegistrationResponse> {
        return this.http.post<RegistrationResponse>(environment.backendUrl + '/anonymous/registration', registration)
    }
}
