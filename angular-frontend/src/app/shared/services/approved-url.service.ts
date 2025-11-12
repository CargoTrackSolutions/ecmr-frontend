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
import { ApprovedUrl } from '../../core/models/Approved-Url/ApprovedUrl';
import { Observable } from 'rxjs';
import { ApprovedUrlCreate } from '../../core/models/Approved-Url/ApprovedUrlCreate';
import { ExportImportApprovedUrl } from '../../core/models/Approved-Url/ExportImportApprovedUrl';

@Injectable({
    providedIn: 'root'
})
export class ApprovedUrlService {

    private http: HttpClient = inject(HttpClient);

    private readonly backendUrl: string = environment.backendUrl + '/approved-url';

    getApprovedUrls(): Observable<ApprovedUrl[]> {
        return this.http.get<ApprovedUrl[]>(this.backendUrl)
    }

    createApprovedUrl(approvedUrlCreate: ApprovedUrlCreate): Observable<ApprovedUrl> {
        return this.http.post<ApprovedUrl>(this.backendUrl, approvedUrlCreate);
    }

    createMultipleApprovedUrls(json: ExportImportApprovedUrl[]) {
        return this.http.post<ApprovedUrl[]>(this.backendUrl + '/multiple', json);
    }

    deleteApprovedUrl(approvedUrlId: number): Observable<boolean> {
        return this.http.delete<boolean>(this.backendUrl + '/' + approvedUrlId);
    }

    updateApprovedUrl(approvedUrlUpdate: ApprovedUrlCreate, approvalId: number): Observable<ApprovedUrl> {
        return this.http.put<ApprovedUrl>(this.backendUrl + '/' + approvalId, approvedUrlUpdate);
    }

    changeUrlApprovals(approvalIds: number[], approve: boolean): Observable<ApprovedUrl[]> {
        const params: HttpParams = new HttpParams();
        params.append('approve', approve)
        return this.http.put<ApprovedUrl[]>(this.backendUrl + '/multiple', {
            body: approvalIds,
            params: params
        });
    }
}
