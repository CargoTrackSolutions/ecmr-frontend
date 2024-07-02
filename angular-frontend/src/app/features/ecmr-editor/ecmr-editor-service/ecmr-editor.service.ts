/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { EcmrConsignment } from '../../../core/models/EcmrConsignment';
import { EcmrData } from '../../../core/models/EcmrData';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EcmrEditorService {

  constructor(private http: HttpClient) { }

  saveEcmr(ecmr: EcmrData){
    return this.http.post<EcmrData>(`${environment.backendUrl}/ecmr`, ecmr)
  }

  getEcmr(ecmrId: string){
    return this.http.get<EcmrData>(`${environment.backendUrl}/ecmr/${ecmrId}`)
  }

  createEmptyEcmrConsignment(): EcmrConsignment {
    return {
      senderInformation: {
        senderNameCompany: null,
        senderNamePerson: null,
        senderStreet: null,
        senderPostcode: null,
        senderCity: null,
        senderCountryCode: {
          value: null,
          region: null
        },
        senderContactInformation:{
          email: null,
          phone: null
        }
      },
      consigneeInformation: {
        consigneeNameCompany: null,
        consigneeNamePerson: null,
        consigneePostcode: null,
        consigneeStreet: null,
        consigneeCity: null,
        consigneeCountryCode: {
          value: null,
          region: null
        },
        consigneeContactInformation:{
          email: null,
          phone: null
        }
      },
      takingOverTheGoods: {
        takingOverTheGoodsPlace: null,
        logisticsTimeOfArrivalDateTime: null,
        logisticsTimeOfDepartureDateTime: null,
      },
      deliveryOfTheGoods: {
        logisticsLocationCity: null,
        logisticsLocationOpeningHours: null
      },
      sendersInstructions: {
        transportInstructionsDescription: null
      },
      carrierInformation: {
        carrierNameCompany: null,
        carrierNamePerson: null,
        carrierPostcode: null,
        carrierStreet: null,
        carrierCity: null,
        carrierCountryCode: {
          value: null,
          region: null
        },
        carrierLicensePlate: null,
        carrierContactInformation:{
          email: null,
          phone: null
        }
      },
      successiveCarrierInformation: {
        successiveCarrierCity: null,
        successiveCarrierCountryCode: {
          value: null,
          region: null
        },
        successiveCarrierName: null,
        successiveCarrierPersonName: null,
        successiveCarrierPostcode: null,
        successiveCarrierSignature: null,
        successiveCarrierSignatureDate: null,
        successiveCarrierStreetName: null,
        successiveCarrierContactInformation:{
          email: null,
          phone: null
        }
      },
      carriersReservationsAndObservationsOnTakingOverTheGoods: {
        carrierReservationsObservations: null,
        senderReservationsObservationsSignature: null
      },
      documentsHandedToCarrier: {
        documentsRemarks: null
      },
      itemList: [],
      specialAgreementsSenderCarrier: {customSpecialAgreement: null},
      toBePaidBy: {
        customChargeCarriage: {
          value: null,
          currency: null,
          payer: null
        },
        customChargeSupplementary: {
          value: null,
          currency: null,
          payer: null
        },
        customChargeCustomsDuties: {
          value: null,
          currency: null,
          payer: null
        },
        customChargeOther: {
          value: null,
          currency: null,
          payer: null
        },
      },
      otherUsefulParticulars: {customParticulars: null},
      cashOnDelivery: {customCashOnDelivery: null},
      established: {
        customEstablishedDate: null,
        customEstablishedIn: null
      },
      signatureOrStampOfTheSender: {
        senderSignature: null
      },
      signatureOrStampOfTheCarrier: {
        carrierSignature: null
      },
      goodsReceived: {
        confirmedLogisticsLocationName: null,
        consigneeReservationsObservations: null,
        consigneeSignature: null,
        consigneeSignatureDate: null,
        consigneeTimeOfArrival: null,
        consigneeTimeOfDeparture: null,
      },
      nonContractualPartReservedForTheCarrier: {nonContractualCarrierRemarks: null},
      referenceIdentificationNumber: {
        value: null
      },
    }
  }
}
