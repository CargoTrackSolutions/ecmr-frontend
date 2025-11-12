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
import { MailSuffix } from '../../core/models/MailSuffix';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MailSuffixService {

    private readonly http: HttpClient = inject(HttpClient);

    private readonly backendUrl = environment.backendUrl + '/mail-suffix';

    getMailSuffixForApprovedUrl(approvedUrl: ApprovedUrl): Observable<MailSuffix[]> {
        return this.http.get<MailSuffix[]>(this.backendUrl + '/for-approved-url/' + approvedUrl.id);
    }

    importMailSuffix(mailSuffixes: MailSuffix[], approvedUrlId: number): Observable<MailSuffix[]> {
        return this.http.post<MailSuffix[]>(this.backendUrl + '/import/' + approvedUrlId, mailSuffixes);
    }

    deleteMailSuffix(suffix: MailSuffix): Observable<boolean> {
        return this.http.delete<boolean>(this.backendUrl + '/' + suffix.id);
    }

    updateMailSuffix(value: string, id: number): Observable<MailSuffix> {
        return this.http.put<MailSuffix>(this.backendUrl + '/' + id, {mailSuffix: value});
    }

    createMailSuffix(value: string, approvedUrlId: number): Observable<MailSuffix> {
        const params = new HttpParams().set('approvedUrlId', approvedUrlId);
        return this.http.post<MailSuffix>(this.backendUrl, {mailSuffix: value}, {
            params: params
        });
    }
}
