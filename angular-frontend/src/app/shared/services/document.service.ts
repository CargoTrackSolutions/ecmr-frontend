/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DocumentModel } from '../../core/models/DocumentModel';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    private readonly http: HttpClient = inject(HttpClient);

    uploadDocument(file: File, ecmrId: string) {
        const formData = new FormData();
        formData.append("file", file);
        return this.http.post<void>(`${environment.backendUrl}/document?ecmrId=` + ecmrId, formData)
    }

    getDocuments(ecmrId: string) {
        return this.http.get<DocumentModel[]>(`${environment.backendUrl}/document?ecmrId=${ecmrId}`);
    }

    deleteDocument(documentId: number) {
        return this.http.delete<void>(`${environment.backendUrl}/document/${documentId}`);
    }

    downloadDocument(documentId: number): Observable<Blob> {
        return this.http.get(`${environment.backendUrl}/document/${documentId}/download`,  { responseType: 'blob' });

    }
}
