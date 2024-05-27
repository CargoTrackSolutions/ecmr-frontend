/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {SenderInformation} from "./areas/one/SenderInformation";
import {ConsigneeInformation} from "./areas/two/ConsigneeInformation";
import {TakingOverTheGoods} from "./areas/three/TakingOverTheGoods";
import {SendersInstructions} from "./areas/five/SendersInstructions";
import {SuccessiveCarriers} from "./areas/seven/SuccessiveCarriers";
import {
  CarriersReservationsAndObservationsOnTakingOverTheGoods
} from "./areas/eight/CarriersReservationsAndObservationsOnTakingOverTheGoods";
import {DocumentsHandedToCarrier} from "./areas/nine/DocumentsHandedToCarrier";
import {Item} from "./compositions/Item";
import {SpecialAgreementsSenderCarrier} from "./areas/sixteen/SpecialAgreementsSenderCarrier";
import {ToBePaidBy} from "./areas/seventeen/ToBePaidBy";
import {OtherUsefulParticulars} from "./areas/eigtheen/OtherUsefulParticulars";
import {CashOnDelivery} from "./areas/nineteen/CashOnDelivery";
import {Established} from "./areas/twentyone/Established";
import {SignatureOrStampOfTheSender} from "./areas/twentytwo/SignatureOrStampOfTheSender";
import {SignatureOrStampOfTheCarrier} from "./areas/twentythree/SignatureOrStampOfTheCarrier";
import {GoodsReceived} from "./areas/twentyfour/GoodsReceived";
import {NonContractualPartReservedForTheCarrier} from "./areas/twentyfive/NonContractualPartReservedForTheCarrier";
import {ReferenceIdentificationNumber} from "./areas/twentysix/ReferenceIdentificationNumber";

export interface EcmrConsignment {
  senderInformation: SenderInformation;
  consigneeInformation: ConsigneeInformation;
  takingOverTheGoods: TakingOverTheGoods;
  deliveryOfTheGoods: TakingOverTheGoods;
  sendersInstructions: SendersInstructions;
  carrierInformation: ConsigneeInformation;
  successiveCarriers: SuccessiveCarriers;
  carriersReservationsAndObservationsOnTakingOverTheGoods: CarriersReservationsAndObservationsOnTakingOverTheGoods;
  documentsHandedToCarrier: DocumentsHandedToCarrier;
  itemList: Item[];
  specialAgreementsSenderCarrier: SpecialAgreementsSenderCarrier;
  toBePaidBy: ToBePaidBy;
  otherUsefulParticulars: OtherUsefulParticulars;
  cashOnDelivery: CashOnDelivery;
  established: Established;
  signatureOrStampOfTheSender: SignatureOrStampOfTheSender;
  signatureOrStampOfTheCarrier: SignatureOrStampOfTheCarrier;
  goodsReceived: GoodsReceived;
  nonContractualPartReservedForTheCarrier: NonContractualPartReservedForTheCarrier;
  referenceIdentificationNumber: ReferenceIdentificationNumber;
}
