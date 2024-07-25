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

@Injectable({
    providedIn: 'root'
})
export class EcmrService {

  static ecmrId = 0;

    constructor(private http: HttpClient) {
    }

    getAllEcmr() {
        return this.http.get<Ecmr[]>(`${environment.backendUrl}/ecmr`)
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

    getAllArchivedEcmr() {
        const params = {'type': EcmrType[EcmrType.ARCHIVED]}
        return this.http.get<Ecmr[]>(`${environment.backendUrl}/ecmr`, {params: params})
    }

    moveToArchive(ecmrId: string) {
        const params = {'type': EcmrType[EcmrType.ARCHIVED]}
        return this.http.patch<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}`, {}, {params: params})
    }

    moveOutOfArchive(ecmrId: string) {
        const params = {'type': EcmrType[EcmrType.ECMR]}
        return this.http.patch<Ecmr>(`${environment.backendUrl}/ecmr/${ecmrId}`, {}, {params: params})
    }

    // EcmrToEcmrElement(Ecmr: Ecmr): EcmrElement {
    //   EcmrOverviewService.ecmrId++;
    //   return {
    //     id: EcmrOverviewService.ecmrId.toString(),
    //     referenceId: Ecmr.ecmrId,
    //     from: Ecmr.ecmrConsignment.senderInformation.senderNameCompany,
    //     to: Ecmr.ecmrConsignment.consigneeInformation.consigneeNameCompany,
    //     transportType: TransportType.International,
    //     lastEditor: Ecmr.ecmrConsignment.senderInformation.senderNamePerson,
    //     status: Status.NEW,
    //     lastEditDate: Ecmr.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp.toString(),
    //     creationDate: Ecmr.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp.toString()
    //   }
    // }
    downloadPdf(ecmrId: string) {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        return this.http.get(`${environment.backendUrl}/ecmr/pdf/${ecmrId}`, {headers, responseType: 'blob', observe: 'response'});
    }

    deleteEcmr(ecmrId: string) {
    const params = {'type':  EcmrType[EcmrType.ECMR]}
    return this.http.delete(`${environment.backendUrl}/ecmr/${ecmrId}`, {params: params});
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
