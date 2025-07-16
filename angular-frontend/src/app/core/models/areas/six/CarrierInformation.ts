/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { CarrierContactInformation } from './CarrierContactInformation';
import { CarrierCountryCode } from './CarrierCountryCode';

export interface CarrierInformation {
  carrierCompanyName: string | null;
  carrierDriverName: string | null;
  carrierStreet: string | null;
  carrierPostcode: string | null;
  carrierCity: string | null;
  carrierCountryCode: CarrierCountryCode;
  carrierLicensePlate: string | null;
  carrierContactInformation: CarrierContactInformation;
}
