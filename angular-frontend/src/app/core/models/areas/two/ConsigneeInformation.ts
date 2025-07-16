/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ConsigneeContactInformation } from './ConsigneeContactInformation';
import { ConsigneeCountryCode } from './ConsigneeCountryCode';

export interface ConsigneeInformation {
  consigneeCompanyName: string | null;
  consigneePersonName: string | null;
  consigneeStreet: string | null;
  consigneePostcode: string | null;
  consigneeCity: string | null;
  consigneeCountryCode: ConsigneeCountryCode;
  consigneeContactInformation: ConsigneeContactInformation;
}
