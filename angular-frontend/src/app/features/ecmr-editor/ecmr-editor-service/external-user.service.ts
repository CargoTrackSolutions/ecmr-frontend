/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Ecmr } from '../../../core/models/Ecmr';
import { environment } from '../../../../environments/environment';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { Observable } from 'rxjs';
import { Signature } from '../../../core/models/areas/signature/Signature';
import { EcmrShare } from '../../../core/models/EcmrShare';
import { EcmrShareResponse } from '../../../core/models/EcmrShareResponse';
import { SealMetadata } from '../../../core/models/SealMetadata';

@Injectable({
    providedIn: 'root'
})
export class ExternalUserService {
    private http = inject(HttpClient);


    constructor() {
        const handler = inject(HttpBackend);

        this.http = new HttpClient(handler);
    }

    getEcmrWithTan(ecmrId: string, userToken: string, tan: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}`, {params: {'tan': tan, 'userToken': userToken}});
    }

    isTanValid(ecmrId: string, userToken: string, tan: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/anonymous/is-tan-valid`, {
            params: {
                'ecmrId': ecmrId,
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getEcmrRolesForUser(ecmrId: string, userToken: string, tan: string): Observable<EcmrRole[]> {
        return this.http.get<EcmrRole[]>(`${environment.backendUrl}/anonymous/ecmr-role`, {
            params: {
                'ecmrId': ecmrId,
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    updateEcmr(ecmr: Ecmr, userToken: string, tan: string) {
        return this.http.put<Ecmr>(`${environment.backendUrl}/anonymous/ecmr`, ecmr, {params: {'tan': tan, 'userToken': userToken}})
    }

    sealEcmr(id: string, userToken: string, tan: string) {
        return this.http.post<Signature>(`${environment.backendUrl}/anonymous/ecmr/${id}/seal`, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getShareToken(ecmrId: string, role: EcmrRole, userToken: string, tan: string) {
        return this.http.get(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/share-token`, {
            params: {'ecmrRole': role, 'tan': tan, 'userToken': userToken},
            responseType: 'text'
        });
    }

    downloadPdf(ecmrId: string, userToken: string, tan: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/pdf`, {
            headers,
            responseType: 'blob',
            observe: 'response',
            params: {'tan': tan, 'userToken': userToken}
        });
    }

    shareEcmr(ecmrShare: EcmrShare, ecmrId: string, userToken: string, tan: string) {
        return this.http.patch<EcmrShareResponse>(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/share`, ecmrShare, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getSealMetadata(ecmrId: string, userToken: string, tan: string): Observable<SealMetadata[]> {
        return this.http.get<SealMetadata[]>(`${environment.backendUrl}/anonymous/ecmr/${ecmrId}/seal-metadata`, {
            params: {'tan': tan, 'userToken': userToken}
        });
    }
}
