/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Ecmr } from '../../../core/models/Ecmr';
import { environment } from '../../../../environments/environment';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { Observable } from 'rxjs';
import { Sign } from '../../../core/models/Sign';
import { Signature } from '../../../core/models/areas/signature/Signature';

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

    updateEcmr(ecmr: Ecmr, tan: string) {
        return this.http.put<Ecmr>(`${environment.backendUrl}/anonymous/ecmr`, ecmr, {params: {'tan': tan}})
    }

    signEcmr(signModel: Sign, id: string, tan: string) {
        return this.http.post<Signature>(`${environment.backendUrl}/anonymous/ecmr/${id}/sign-on-glass`, signModel, {params: {'tan': tan}});
    }

    getShareToken(ecmrId: string, role: EcmrRole, tan: string) {
        return this.http.get(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/share-token`, {
            params: {'ecmrRole': role, 'tan': tan},
            responseType: 'text'
        });
    }

    downloadPdf(ecmrId: string, tan: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/pdf`, {
            headers,
            responseType: 'blob',
            observe: 'response',
            params: {'tan': tan}
        });
    }
}
