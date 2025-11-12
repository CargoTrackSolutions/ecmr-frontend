/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EcmrImport } from '../../core/models/EcmrImport';
import { Observable } from 'rxjs';
import { PendingInstance } from '../../core/models/Approved-Url/PendingInstance';

@Injectable({
    providedIn: 'root'
})
export class EcmrImportService {

    private http: HttpClient = inject(HttpClient);

    private readonly backendUrl: string = environment.backendUrl + '/ecmr-import';

    getEcmrImports(): Observable<EcmrImport[]> {
        return this.http.get<EcmrImport[]>(this.backendUrl);
    }

    getPendingInstances(): Observable<PendingInstance[]> {
        return this.http.get<PendingInstance[]>(this.backendUrl + '/pending-instances');
    }

    handleApprovalOfPendingEcmr(ecmrImport: PendingInstance, approve: boolean) {
        const params = new HttpParams()
            .set('approvedState', approve)

        return this.http.put(this.backendUrl + '/handle-approval', ecmrImport.url, {params});
    }
}