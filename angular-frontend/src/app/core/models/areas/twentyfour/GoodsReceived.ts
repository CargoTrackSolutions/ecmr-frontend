/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Signature } from '../signature/Signature';

export interface GoodsReceived {
  confirmedLogisticsLocationName: string | null;
  consigneeReservationsObservations: string | null;
  consigneeSignature: Signature | null;
  consigneeSignatureDate: Date | null;
  consigneeTimeOfArrival: Date | null;
  consigneeTimeOfDeparture: Date | null;
}
