/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { EcmrData } from '../../../core/models/EcmrData';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EcmrOverviewService {

  static ecmrId = 0;

  constructor(private http: HttpClient) {
  }


  getAllEcmr() {
    return this.http.get<EcmrData[]>(`${environment.backendUrl}/ecmr`)
  }

  // ecmrDataToEcmrElement(ecmrData: EcmrData): EcmrElement {
  //   EcmrOverviewService.ecmrId++;
  //   return {
  //     id: EcmrOverviewService.ecmrId.toString(),
  //     referenceId: ecmrData.ecmrId,
  //     from: ecmrData.ecmrConsignment.senderInformation.senderNameCompany,
  //     to: ecmrData.ecmrConsignment.consigneeInformation.consigneeNameCompany,
  //     transportType: TransportType.International,
  //     lastEditor: ecmrData.ecmrConsignment.senderInformation.senderNamePerson,
  //     status: Status.NEW,
  //     lastEditDate: ecmrData.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp.toString(),
  //     creationDate: ecmrData.ecmrConsignment.signatureOrStampOfTheSender.senderSignature!.timestamp.toString()
  //   }
  // }
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
  NEW = "New",
  LOADING = "Loading",
  IN_TRANSPORT = "In Transport",
  ARRIVED_AT_DESTINATION = "Arrived at destination"
}

enum TransportType {
  National = "national",
  International = "international"
}
