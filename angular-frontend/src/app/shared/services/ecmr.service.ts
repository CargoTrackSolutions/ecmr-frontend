/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EcmrType } from '../../core/models/EcmrType';
import { Ecmr } from '../../core/models/Ecmr';
import { ShowColumns } from '../../features/ecmr-overview/show-columns';
import { FilterRequest } from '../../features/ecmr-overview/filter-request';
import { environment } from '../../../environments/environment';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { EcmrShareResponse } from '../../core/models/EcmrShareResponse';
import { EcmrShare } from '../../core/models/EcmrShare';
import { EcmrPage } from '../../core/models/EcmrPage';
import { EcmrTransportType } from '../../core/models/EcmrTransportType';
import {GroupFlat} from "../../core/models/GroupFlat";
import {Observable} from "rxjs";
import { Sort } from '@angular/material/sort';
import { EcmrShareWithGroup } from '../../core/models/EcmrShareWithGroup';
import { EcmrAssignment } from '../../core/models/EcmrAssignment';

@Injectable({
    providedIn: 'root'
})
export class EcmrService {

    constructor(private http: HttpClient) {
    }

    getAllEcmr(filterRequest: FilterRequest, ecmrType: EcmrType, page: number, size: number, sortBy: string | null, sortingOrder: string) {
        let params: HttpParams = new HttpParams().set('type', ecmrType).set('page', page).set('size', size).set('sortingOrder', sortingOrder);
        if (sortBy) params = params.set('sortBy', sortBy);
        return this.http.post<EcmrPage>(`${environment.backendUrl}/ecmr/my-ecmrs`, filterRequest, {params: params})
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
        sessionStorage.setItem('filterRequest', filterString);
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
        const filterString: string | null = sessionStorage.getItem('filterRequest');
        if (filterString) {
            return JSON.parse(filterString)
        } else {
            return null
        }
    }

    saveEcmrSort(sort: Sort, ecmrType: EcmrType) {
        const key = this.getEcmrSortKey(ecmrType);
        if(sort.active && sort.direction) {
            const sortString: string = JSON.stringify(sort);
            localStorage.setItem(key, sortString);
        }else {
            localStorage.removeItem(key);
        }
    }

    getEcmrSort(ecmrType: EcmrType): Sort | null {
        const key = this.getEcmrSortKey(ecmrType);
        const sortString: string | null = localStorage.getItem(key);
        if (sortString) {
            return JSON.parse(sortString)
        } else {
            return null
        }
    }

    private getEcmrSortKey(ecmrType: EcmrType): string {
        return `sort_${ecmrType}`;
    }

    getTransportType(ecmr: Ecmr) {
        if (!ecmr) {
            return null;
        }
        const senderCountryCode = ecmr.ecmrConsignment.senderInformation.senderCountryCode.value;
        const consigneeCountryCode = ecmr.ecmrConsignment.consigneeInformation.consigneeCountryCode.value;
        if (!senderCountryCode || !consigneeCountryCode) {
            return null;
        }
        return senderCountryCode === consigneeCountryCode
            ? EcmrTransportType.National
            : EcmrTransportType.International;
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

    shareEcmrWithGroup(ecmrShareWithGroup: EcmrShareWithGroup, ecmrId: string) {
        return this.http.patch<EcmrShareResponse>(`${environment.backendUrl}/ecmr/${ecmrId}/shareWithGroup`, ecmrShareWithGroup);
    }    

    shareEcmrExternal( ecmrShare: EcmrShare, ecmrId: string) {
      const params = new HttpParams()
        .set('receiverEmail', ecmrShare.email)
        .set('ecmrRole', ecmrShare.role);
      return this.http.post<EcmrShareResponse>(`${environment.backendUrl}/external/ecmr/${ecmrId}/email`, null, {params: params})
    }

    importEcmr(ecmrId: string) {
        return this.http.get<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}/import`);
    }

    importExternalEcmr(token: string, url: string, ecmrId: string, groups: GroupFlat[]): Observable<void> {
      const groupIds = groups.map(group => group.id);
      const params = new HttpParams()
        .set('ecmrId', ecmrId)
        .set('shareToken', token)
        .set('groupId', groupIds.toString())
        .set('url', url);
      return this.http.post<void>(`${environment.backendUrl}/external/ecmr/import`,null,  {params: params});
    }

    getEcmrRolesForCurrentUser(ecmrId: string) {
        return this.http.get<EcmrRole[]>(`${environment.backendUrl}/ecmr/${ecmrId}/role`);
    }

    getEcmrAssignments(ecmrId: string): Observable<EcmrAssignment[]> {
        return this.http.get<EcmrAssignment[]>(`${environment.backendUrl}/ecmr/${ecmrId}/assignments`);
    }

}
