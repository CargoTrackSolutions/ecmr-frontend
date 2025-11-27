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
import { FileModel } from '../../core/models/File.model';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private readonly http: HttpClient = inject(HttpClient);

    private readonly backendUrl = environment.backendUrl;

    uploadFilesForEcmr(files: File[], ecmrId: string) {
        return this.http.post<File[]>(`${environment.backendUrl}/file/upload/ecmr/` + ecmrId, files)
    }

    getFilesForEcmr(ecmrId: string) {
        return this.http.get<FileModel[]>(`${environment.backendUrl}/file/ecmr/${ecmrId}`);
    }

    deleteFileWithId(fileId: number) {
        return this.http.delete<boolean>(`${environment.backendUrl}/file/${fileId}`);
    }

}
