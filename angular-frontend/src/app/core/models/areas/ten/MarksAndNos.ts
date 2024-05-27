/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {LogisticsShippingMarksMarking} from "./LogisticsShippingMarksMarking";
import {LogisticsShippingMarksCustomBarcode} from "./LogisticsShippingMarksCustomBarcode";

export interface MarksAndNos {
  logisticsShippingMarksMarking: LogisticsShippingMarksMarking;
  logisticsShippingMarksCustomBarcode: LogisticsShippingMarksCustomBarcode;
}
