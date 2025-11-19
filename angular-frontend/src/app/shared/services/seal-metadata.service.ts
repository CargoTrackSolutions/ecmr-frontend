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
import { SealMetadata } from '../../core/models/SealMetadata';

@Injectable({
    providedIn: 'root'
})
export class SealMetadataService {
    private http = inject(HttpClient);

    getSealMetadata(ecmrId: string): Observable<SealMetadata[]> {
        return this.http.get<SealMetadata[]>(`${environment.backendUrl}/ecmr/${ecmrId}/seal-metadata`);
    }

}
