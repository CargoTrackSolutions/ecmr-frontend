/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export interface ConsigneeCountryCode {
  // region or state within the country of the sender
  region: string | null;
  // ISO 3166-1 Country Code
  value: string | null;
}
