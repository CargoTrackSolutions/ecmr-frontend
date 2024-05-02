/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details one the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */
import {CarrierReservationsObservations} from './CarrierReservationsObservations';
import {SenderReservationsObservationsSignature} from "./SenderReservationsObservationsSignature";

export interface CarriersReservationsAndObservationsOnTakingOverTheGoods {
  carrierReservationsObservations: CarrierReservationsObservations;
  senderReservationsObservationsSignature: SenderReservationsObservationsSignature;
}
