/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Injectable} from '@angular/core';
import {EcmrData} from "../../../core/models/EcmrData";

@Injectable({
  providedIn: 'root'
})
export class EcmrOverviewService {

  static ecmrId = 0;

  constructor() {
  }

  ecmrData1: EcmrData = {
    ecmrId: "FhG-IML-504",
    ecmrConsignment: {
      senderInformation: {
        senderNameCompany: {value: "IML"},
        senderNamePerson: {value: "Peter Müller"},
        senderStreet: {value: "Joseph-von-Fraunhofer-Str. 2-4"},
        senderPostcode: {value: "44227"},
        senderCity: {value: "Dortmund"},
        senderCountry: {region: "NRW", value: "DE"},
      },
      consigneeInformation: {
        consigneeNameCompany: {value: "Rhenus"},
        consigneeNamePerson: {value: "Martina Hill"},
        consigneePostcode: {value: "44227"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      takingOverTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods taking over value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      deliveryOfTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods delivery value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      sendersInstructions: {
        transportInstructionsDescription: {value: "Truck"}
      },
      carrierInformation: {
        consigneeNameCompany: {value: "DB Schenker"},
        consigneeNamePerson: {value: "Thorsten Baumann"},
        consigneePostcode: {value: "44279"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      successiveCarriers: {
        successiveCarrierCity: {value: "Dortmund"},
        successiveCarrierCountry: {value: "Germany"},
        successiveCarrierName: {value: "DHL"},
        successiveCarrierPersonName: {value: "Angelika Trommel"},
        successiveCarrierPostcode: {value: "44809"},
        successiveCarrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        successiveCarrierSignatureDate: {value: new Date()},
        successiveCarrierStreetName: {value: "Dahlacker 12"},
      },
      carriersReservationsAndObservationsOnTakingOverTheGoods: {
        carrierReservationsObservations: {value: "Observations"},
        senderReservationsObservationsSignature: {
          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      documentsHandedToCarrier: {
        documentsRemarks: {value: "Remarks"}
      },
      itemList: [{
        marksAndNos:
          {
            logisticsShippingMarksMarking: {value: ""},
            logisticsShippingMarksCustomBarcode: {value: ""}
          },
        numberOfPackages: {logisticsPackageItemQuantity: {value: 5}},
        methodOfPacking: {logisticsPackageType: {value: "boxed"}},
        natureOfTheGoods: {transportCargoIdentification: {value: ""}},
        grossWeightInKg: {supplyChainConsignmentItemGrossWeight: {value: 123}},
        volumeInM3: {supplyChainConsignmentItemGrossVolume: {value: 15}}
      }],
      specialAgreementsSenderCarrier: {customSpecialAgreement: {value: ""}},
      toBePaidBy: {
        customChargeCarriage: {value: 5},
        customChargeSupplementary: {value: 5},
        customChargeCustomsDuties: {value: 5},
        customChargeOther: {value: 5}
      },
      otherUsefulParticulars: {customParticulars: {value: ""}},
      cashOnDelivery: {customCashOnDelivery: {value: 12}},
      established: {
        customEstablishedDate: {value: new Date()},
        customEstablishedIn: {value: ""}
      },
      signatureOrStampOfTheSender: {
        senderSignature: {
          value: {
            type: "",
            userName: "Anna Tellman",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      signatureOrStampOfTheCarrier: {
        carrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      goodsReceived: {
        confirmedLogisticsLocationName: {value: ""},
        consigneeReservationsObservations: {value: ""},
        consigneeSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        consigneeSignatureDate: {value: new Date()},
        consigneeTimeOfArrival: {value: new Date()},
        consigneeTimeOfDeparture: {value: new Date()},
      },
      nonContractualPartReservedForTheCarrier: {nonContractualCarrierRemarks: {value: ""}},
      referenceIdentificationNumber: {value: "FhG-IML-504"},
    }
  }

  ecmrData2: EcmrData = {
    ecmrId: "FhG-IML-132",
    ecmrConsignment: {
      senderInformation: {
        senderNameCompany: {value: "IML"},
        senderNamePerson: {value: "Simone Hallbach"},
        senderStreet: {value: "Joseph-von-Fraunhofer-Str. 2-4"},
        senderPostcode: {value: "44227"},
        senderCity: {value: "Dortmund"},
        senderCountry: {region: "NRW", value: "DE"},
      },
      consigneeInformation: {
        consigneeNameCompany: {value: "DB Schenker"},
        consigneeNamePerson: {value: "Thorsten Henßel"},
        consigneePostcode: {value: "44227"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      takingOverTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods taking over value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      deliveryOfTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods delivery value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      sendersInstructions: {
        transportInstructionsDescription: {value: "Truck"}
      },
      carrierInformation: {
        consigneeNameCompany: {value: "European Logistics GmbH"},
        consigneeNamePerson: {value: "Hans Thalhammer"},
        consigneePostcode: {value: "50655"},
        consigneeCity: {value: "Köln"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      successiveCarriers: {
        successiveCarrierCity: {value: "Dortmund"},
        successiveCarrierCountry: {value: "Germany"},
        successiveCarrierName: {value: "DHL"},
        successiveCarrierPersonName: {value: "Angelika Trommel"},
        successiveCarrierPostcode: {value: "44809"},
        successiveCarrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        successiveCarrierSignatureDate: {value: new Date()},
        successiveCarrierStreetName: {value: "Dahlacker 12"},
      },
      carriersReservationsAndObservationsOnTakingOverTheGoods: {
        carrierReservationsObservations: {value: "Observations"},
        senderReservationsObservationsSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      documentsHandedToCarrier: {
        documentsRemarks: {value: "Remarks"}
      },
      itemList: [{
        marksAndNos:
          {
            logisticsShippingMarksMarking: {value: ""},
            logisticsShippingMarksCustomBarcode: {value: ""}
          },
        numberOfPackages: {logisticsPackageItemQuantity: {value: 5}},
        methodOfPacking: {logisticsPackageType: {value: "boxed"}},
        natureOfTheGoods: {transportCargoIdentification: {value: ""}},
        grossWeightInKg: {supplyChainConsignmentItemGrossWeight: {value: 123}},
        volumeInM3: {supplyChainConsignmentItemGrossVolume: {value: 15}}
      }],
      specialAgreementsSenderCarrier: {customSpecialAgreement: {value: ""}},
      toBePaidBy: {
        customChargeCarriage: {value: 5},
        customChargeSupplementary: {value: 5},
        customChargeCustomsDuties: {value: 5},
        customChargeOther: {value: 5}
      },
      otherUsefulParticulars: {customParticulars: {value: ""}},
      cashOnDelivery: {customCashOnDelivery: {value: 12}},
      established: {
        customEstablishedDate: {value: new Date()},
        customEstablishedIn: {value: ""}
      },
      signatureOrStampOfTheSender: {
        senderSignature: {
          value: {
            type: "",
            userName: "Simone Hallbach",
            userCompany: "IML",
            userStreet: "Joseph-von-Fraunhofer-Str. 2-4",
            userPostCode: "44227",
            userCity: "Dortmund",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      signatureOrStampOfTheCarrier: {
        carrierSignature: {

          value: {
            type: "",
            userName: "Michel Lönneberger",
            userCompany: "UPS",
            userStreet: "Feldstraße 7",
            userPostCode: "07044",
            userCity: "Mönsheim",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      goodsReceived: {
        confirmedLogisticsLocationName: {value: ""},
        consigneeReservationsObservations: {value: ""},
        consigneeSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        consigneeSignatureDate: {value: new Date()},
        consigneeTimeOfArrival: {value: new Date()},
        consigneeTimeOfDeparture: {value: new Date()},
      },
      nonContractualPartReservedForTheCarrier: {nonContractualCarrierRemarks: {value: ""}},
      referenceIdentificationNumber: {value: "FhG-IML-132"},
    }
  }

  ecmrData3: EcmrData = {
    ecmrId: "FhG-ISST-981",
    ecmrConsignment: {
      senderInformation: {
        senderNameCompany: {value: "ISST"},
        senderNamePerson: {value: "Noah Simons"},
        senderStreet: {value: "Speicherstraße 6"},
        senderPostcode: {value: "44147"},
        senderCity: {value: "Dortmund"},
        senderCountry: {region: "NRW", value: "DE"},
      },
      consigneeInformation: {
        consigneeNameCompany: {value: "Rhenus"},
        consigneeNamePerson: {value: "Martina Hill"},
        consigneePostcode: {value: "44227"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      takingOverTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods taking over value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      deliveryOfTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods delivery value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      sendersInstructions: {
        transportInstructionsDescription: {value: "Truck"}
      },
      carrierInformation: {
        consigneeNameCompany: {value: "DB Schenker"},
        consigneeNamePerson: {value: "Thorsten Baumann"},
        consigneePostcode: {value: "44279"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      successiveCarriers: {
        successiveCarrierCity: {value: "Dortmund"},
        successiveCarrierCountry: {value: "Germany"},
        successiveCarrierName: {value: "DHL"},
        successiveCarrierPersonName: {value: "Angelika Trommel"},
        successiveCarrierPostcode: {value: "44809"},
        successiveCarrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        successiveCarrierSignatureDate: {value: new Date()},
        successiveCarrierStreetName: {value: "Dahlacker 12"},
      },
      carriersReservationsAndObservationsOnTakingOverTheGoods: {
        carrierReservationsObservations: {value: "Observations"},
        senderReservationsObservationsSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      documentsHandedToCarrier: {
        documentsRemarks: {value: "Remarks"}
      },
      itemList: [{
        marksAndNos:
          {
            logisticsShippingMarksMarking: {value: ""},
            logisticsShippingMarksCustomBarcode: {value: ""}
          },
        numberOfPackages: {logisticsPackageItemQuantity: {value: 5}},
        methodOfPacking: {logisticsPackageType: {value: "boxed"}},
        natureOfTheGoods: {transportCargoIdentification: {value: ""}},
        grossWeightInKg: {supplyChainConsignmentItemGrossWeight: {value: 123}},
        volumeInM3: {supplyChainConsignmentItemGrossVolume: {value: 15}}
      }],
      specialAgreementsSenderCarrier: {customSpecialAgreement: {value: ""}},
      toBePaidBy: {
        customChargeCarriage: {value: 5},
        customChargeSupplementary: {value: 5},
        customChargeCustomsDuties: {value: 5},
        customChargeOther: {value: 5}
      },
      otherUsefulParticulars: {customParticulars: {value: ""}},
      cashOnDelivery: {customCashOnDelivery: {value: 12}},
      established: {
        customEstablishedDate: {value: new Date()},
        customEstablishedIn: {value: ""}
      },
      signatureOrStampOfTheSender: {
        senderSignature: {

          value: {
            type: "",
            userName: "Noah Simons",
            userCompany: "ISST",
            userStreet: "Speicherstraße 6",
            userPostCode: "44147",
            userCity: "Dortmund",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      signatureOrStampOfTheCarrier: {
        carrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      goodsReceived: {
        confirmedLogisticsLocationName: {value: ""},
        consigneeReservationsObservations: {value: ""},
        consigneeSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        consigneeSignatureDate: {value: new Date()},
        consigneeTimeOfArrival: {value: new Date()},
        consigneeTimeOfDeparture: {value: new Date()},
      },
      nonContractualPartReservedForTheCarrier: {nonContractualCarrierRemarks: {value: ""}},
      referenceIdentificationNumber: {value: "FhG-ISST-981"},
    }
  }

  ECMR_DATA_LIST: EcmrData[] = []

  ECMR_ELEMENT_DATA: EcmrElement[] = [
    {
      id: "123ab15c",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "524a32bc",
      referenceId: "FhG-IML-002",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.LOADING,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "22555abc",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.IN_TRANSPORT,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "726a2b5c",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.ARRIVED_AT_DESTINATION,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "427abc21",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "0928a5bc",
      referenceId: "FhG-IML-004",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "f29ab23c",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.International,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "as20af1c",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "1d334abc",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "fg123abc",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.National,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
    {
      id: "sq123abc",
      referenceId: "FhG-IML-001",
      from: "Fraunhofer Institute (IML)",
      to: "Fraunhofer Gesellschaft",
      transportType: TransportType.International,
      lastEditor: "Peter Zwegat",
      status: Status.NEW,
      lastEditDate: "06.03.2024",
      creationDate: "05.03.2024"
    },
  ];

  /**
   * TODO: implement proper method to retrieve data from a specific source.
   */
  initializeData() {
    this.ECMR_DATA_LIST.push(this.ecmrData1);
    this.ECMR_DATA_LIST.push(this.ecmrData2);
    this.ECMR_DATA_LIST.push(this.ecmrData3);
  }

  getData() {
    return this.ECMR_DATA_LIST;
  }

  ecmrDataToEcmrElement(ecmrData: EcmrData): EcmrElement {
    EcmrOverviewService.ecmrId++;
    return {
      id: EcmrOverviewService.ecmrId.toString(),
      referenceId: ecmrData.ecmrId,
      from: ecmrData.ecmrConsignment.senderInformation.senderNameCompany.value,
      to: ecmrData.ecmrConsignment.consigneeInformation.consigneeNameCompany.value,
      transportType: TransportType.International,
      lastEditor: ecmrData.ecmrConsignment.senderInformation.senderNamePerson.value,
      status: Status.NEW,
      lastEditDate: ecmrData.ecmrConsignment.signatureOrStampOfTheSender.senderSignature.value.timestamp.toString(),
      creationDate: ecmrData.ecmrConsignment.signatureOrStampOfTheSender.senderSignature.value.timestamp.toString()
    }
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
  NEW = "New",
  LOADING = "Loading",
  IN_TRANSPORT = "In Transport",
  ARRIVED_AT_DESTINATION = "Arrived at destination"
}

enum TransportType {
  National = "national",
  International = "international"
}
