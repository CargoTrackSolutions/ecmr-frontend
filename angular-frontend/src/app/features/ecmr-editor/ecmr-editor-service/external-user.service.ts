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
import { DocumentModel } from '../../../core/models/DocumentModel';

@Injectable({
    providedIn: 'root'
})
export class ExternalUserService {
    private http = inject(HttpClient);

    private readonly anonymousUrl = environment.backendUrl + '/anonymous';

    constructor() {
        const handler = inject(HttpBackend);

        this.http = new HttpClient(handler);
    }

    getEcmrWithTan(ecmrId: string, userToken: string, tan: string) {
        return this.http.get<Ecmr>(`${this.anonymousUrl}/ecmr/${ecmrId}`, {params: {'tan': tan, 'userToken': userToken}});
    }

    isTanValid(ecmrId: string, userToken: string, tan: string) {
        return this.http.get<Ecmr>(`${this.anonymousUrl}/is-tan-valid`, {
            params: {
                'ecmrId': ecmrId,
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getEcmrRolesForUser(ecmrId: string, userToken: string, tan: string): Observable<EcmrRole[]> {
        return this.http.get<EcmrRole[]>(`${this.anonymousUrl}/ecmr-role`, {
            params: {
                'ecmrId': ecmrId,
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    updateEcmr(ecmr: Ecmr, userToken: string, tan: string) {
        return this.http.put<Ecmr>(`${this.anonymousUrl}/ecmr`, ecmr, {params: {'tan': tan, 'userToken': userToken}})
    }

    sealEcmr(id: string, userToken: string, tan: string) {
        return this.http.post<Signature>(`${this.anonymousUrl}/ecmr/${id}/seal`, null, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getShareToken(ecmrId: string, role: EcmrRole, userToken: string, tan: string) {
        return this.http.get(`${this.anonymousUrl}/ecmr/${ecmrId}/share-token`, {
            params: {'ecmrRole': role, 'tan': tan, 'userToken': userToken},
            responseType: 'text'
        });
    }

    downloadPdf(ecmrId: string, userToken: string, tan: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(`${this.anonymousUrl}/ecmr/${ecmrId}/pdf`, {
            headers,
            responseType: 'blob',
            observe: 'response',
            params: {'tan': tan, 'userToken': userToken}
        });
    }

    shareEcmr(ecmrShare: EcmrShare, ecmrId: string, userToken: string, tan: string) {
        return this.http.patch<EcmrShareResponse>(`${this.anonymousUrl}/ecmr/${ecmrId}/share`, ecmrShare, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    getSealMetadata(ecmrId: string, userToken: string, tan: string): Observable<SealMetadata[]> {
        return this.http.get<SealMetadata[]>(`${this.anonymousUrl}/ecmr/${ecmrId}/seal-metadata`, {
            params: {'tan': tan, 'userToken': userToken}
        });
    }

    uploadDocument(file: File, ecmrId: string, userToken: string, tan: string) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<void>(`${this.anonymousUrl}/document?ecmrId=` + ecmrId, formData, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        })
    }

    getDocuments(ecmrId: string, userToken: string, tan: string) {
        return this.http.get<DocumentModel[]>(`${this.anonymousUrl}/document?ecmrId=${ecmrId}`, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    deleteDocument(documentId: number, userToken: string, tan: string) {
        return this.http.delete<void>(`${this.anonymousUrl}/document/${documentId}`, {
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });
    }

    downloadDocument(documentId: number, userToken: string, tan: string): Observable<Blob> {
        return this.http.get(`${this.anonymousUrl}/document/${documentId}/download`, {
            responseType: 'blob',
            params: {
                'tan': tan,
                'userToken': userToken
            }
        });

    }
}
