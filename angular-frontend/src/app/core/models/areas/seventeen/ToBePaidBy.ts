/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {CustomChargeCarriage} from "./CustomChargeCarriage";
import {CustomChargeSupplementary} from "./CustomChargeSupplementary";
import {CustomChargeCustomsDuties} from "./CustomChargeCustomsDuties";
import {CustomChargeOther} from "./CustomChargeOther";

export interface ToBePaidBy {
  customChargeCarriage: CustomChargeCarriage;
  customChargeSupplementary: CustomChargeSupplementary;
  customChargeCustomsDuties: CustomChargeCustomsDuties;
  customChargeOther: CustomChargeOther;
}
