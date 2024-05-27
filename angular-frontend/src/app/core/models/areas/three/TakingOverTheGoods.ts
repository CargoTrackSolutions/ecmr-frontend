/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {LogisticsTakingOverTheGoods} from "./LogisticsTakingOverTheGoods";
import {LogisticsTakingOverTheGoodsCountry} from "./LogisticsTakingOverTheGoodsCountry";
import {LogisticsEventActualOccurrence} from "./LogisticsEventActualOccurrence";
import {LogisticsTimeOfArrivalDate} from "./LogisticsTimeOfArrivalDate";
import {LogisticsTimeOfDepartureDate} from "./LogisticsTimeOfDepartureDate";

export interface TakingOverTheGoods {
  logisticsTakingOverTheGoods: LogisticsTakingOverTheGoods;
  logisticsTakingOverTheGoodsCountry: LogisticsTakingOverTheGoodsCountry;
  logisticsEventActualOccurrence: LogisticsEventActualOccurrence;
  logisticsTimeOfArrivalDate: LogisticsTimeOfArrivalDate;
  logisticsTimeOfDepartureDate: LogisticsTimeOfDepartureDate;
}
