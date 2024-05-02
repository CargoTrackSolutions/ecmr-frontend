/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details one the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */
import {LogisticsLocationName} from "./LogisticsLocationName";
import {LogisticsCountry} from "./LogisticsCountry";
import {LogisticsLocationOpeningHours} from "./LogisticsLocationOpeningHours";

export interface DeliveryOfTheGoods {
  logisticsLocationName: LogisticsLocationName;
  logisticsCountry: LogisticsCountry;
  logisticsLocationOpeningHours: LogisticsLocationOpeningHours;
}
