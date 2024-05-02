/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details one the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */
import {Signature} from "../signature/Signature";

export interface SenderReservationsObservationsSignature {
  customCode: string;
  value: Signature;
}
