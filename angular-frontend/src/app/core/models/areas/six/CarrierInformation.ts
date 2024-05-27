/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {CarrierName} from "./CarrierName";
import {CarrierPersonName} from "./CarrierPersonName";
import {CarrierStreetName} from "./CarrierStreetName";
import {CarrierPostcode} from "./CarrierPostcode";
import {CarrierCity} from "./CarrierCity";
import {CarrierCountryCode} from "./CarrierCountryCode";
import {CarrierLicensePlate} from "./CarrierLicensePlate";

export interface CarrierInformation {
  carrierName: CarrierName;
  carrierPersonName: CarrierPersonName;
  carrierStreetName: CarrierStreetName;
  carrierPostcode: CarrierPostcode;
  carrierCity: CarrierCity;
  carrierCountry: CarrierCountryCode;
  carrierLicensePlate: CarrierLicensePlate
}
