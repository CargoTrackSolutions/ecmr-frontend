/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EcmrType } from '../../core/models/EcmrType';
import { Ecmr } from '../../core/models/Ecmr';
import { ShowColumns } from '../../features/ecmr-overview/show-columns';
import { FilterRequest } from '../../features/ecmr-overview/filter-request';
import { environment } from '../../../environments/environment';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { EcmrShareResponse } from '../../core/models/EcmrShareResponse';
import { EcmrShare } from '../../core/models/EcmrShare';
import { EcmrPage } from '../../core/models/EcmrPage';

@Injectable({
    providedIn: 'root'
})
export class EcmrService {

    static ecmrId = 0;

    constructor(private http: HttpClient) {
    }

    getAllEcmr(filterRequest: FilterRequest, page: number, size: number, sortBy: string | null, sortingOrder: string) {
        return this.http.post<EcmrPage>(`${environment.backendUrl}/ecmr/my-ecmrs`, filterRequest, {
            params: {
                'page': page,
                'size': size,
                'sortingOrder': sortingOrder
            }
        })
    }

    getAllArchivedEcmr(filterRequest: FilterRequest, page: number, size: number, sortBy: string | null, sortingOrder: string) {
        return this.http.post<EcmrPage>(`${environment.backendUrl}/ecmr/my-ecmrs`, filterRequest, {
            params: {
                'type': [EcmrType.ARCHIVED],
                'page': page,
                'size': size,
                'sortingOrder': sortingOrder
            }
        })
    }

    getShareToken(ecmrId: string, role: EcmrRole) {
        return this.http.get(`${environment.backendUrl}/ecmr/${ecmrId}/share-token`, {params: {'ecmrRole': role}, responseType: 'text'});
    }

    saveDisplayedColumns(columns: string[]) {
        const columnString: string = JSON.stringify(columns);
        localStorage.setItem('columns', columnString);
    }

    saveShowColumns(showColumns: ShowColumns) {
        const columnString: string = JSON.stringify(showColumns);
        localStorage.setItem('showColumns', columnString);
    }

    saveFilterRequest(filterRequest: FilterRequest) {
        const filterString: string = JSON.stringify(filterRequest);
        localStorage.setItem('filterRequest', filterString);
    }

    getDisplayedColumns(): string[] | null {
        const columnString: string | null = localStorage.getItem('columns');
        if (columnString) {
            return JSON.parse(columnString)
        } else {
            return null
        }
    }

    getShowColumns(): ShowColumns | null {
        const columnString: string | null = localStorage.getItem('showColumns');
        if (columnString) {
            return JSON.parse(columnString)
        } else {
            return null
        }
    }

    getFilterRequest(): FilterRequest | null {
        const filterString: string | null = localStorage.getItem('filterRequest');
        if (filterString) {
            return JSON.parse(filterString)
        } else {
            return null
        }
    }

    moveToArchive(ecmrId: string) {
        return this.http.patch<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}/archive`, {}, {})
    }

    moveOutOfArchive(ecmrId: string) {
        return this.http.patch<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}/reactivate`, {}, {})
    }

    downloadPdf(ecmrId: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(`${environment.backendUrl}/ecmr/${ecmrId}/pdf`, {headers, responseType: 'blob', observe: 'response'});
    }

    deleteEcmr(ecmrId: string) {
        const params = {'type': EcmrType[EcmrType.ECMR]}
        return this.http.delete(`${environment.backendUrl}/ecmr/${ecmrId}`, {params: params});
    }

    shareEcmr(ecmrShare: EcmrShare, ecmrId: string) {
        return this.http.patch<EcmrShareResponse>(`${environment.backendUrl}/ecmr/${ecmrId}/share`, ecmrShare);
    }

    importEcmr(ecmrId: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}/import`);
    }

    getEcmrRolesForCurrentUser(ecmrId: string) {
        return this.http.get<EcmrRole[]>(`${environment.backendUrl}/ecmr/${ecmrId}/role`);
    }
}

export interface EcmrElement {
    id: string;
    referenceId: string;
    from: string;
    to: string;
    transportType: TransportType;
    lastEditor: string;
    status: Status;
    lastEditDate: string;
    creationDate: string;
}

enum Status {
    NEW = 'New',
    LOADING = 'Loading',
    IN_TRANSPORT = 'In Transport',
    ARRIVED_AT_DESTINATION = 'Arrived at destination'
}

enum TransportType {
    National = 'national',
    International = 'international'
}
