/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {ConfirmedLogisticsLocationName} from "./ConfirmedLogisticsLocationName";
import {ConsigneeReservationsObservations} from "./ConsigneeReservationsObservations";
import {ConsigneeSignature} from "./ConsigneeSignature";
import {ConsigneeSignatureDate} from "./ConsigneeSignatureDate";
import {ConsigneeTimeOfArrival} from "./ConsigneeTimeOfArrival";
import {ConsigneeTimeOfDeparture} from "./ConsigneeTimeOfDeparture";

export interface GoodsReceived {
  confirmedLogisticsLocationName: ConfirmedLogisticsLocationName;
  consigneeReservationsObservations: ConsigneeReservationsObservations;
  consigneeSignature: ConsigneeSignature;
  consigneeSignatureDate: ConsigneeSignatureDate;
  consigneeTimeOfArrival: ConsigneeTimeOfArrival;
  consigneeTimeOfDeparture: ConsigneeTimeOfDeparture;
}
