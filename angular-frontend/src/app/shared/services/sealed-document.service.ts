/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SealedDocumentWithoutEcmr } from '../../core/models/SealedDocumentWithoutEcmr';

@Injectable({
    providedIn: 'root'
})
export class SealedDocumentService {
    private http = inject(HttpClient);


    getSealedDocumentWithoutEcmr(ecmrId: string): Observable<SealedDocumentWithoutEcmr> {
        return this.http.get<SealedDocumentWithoutEcmr>(`${environment.backendUrl}/sealed-document/${ecmrId}`);
    }

}
