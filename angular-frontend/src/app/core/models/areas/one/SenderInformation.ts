/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { SenderContactInformation } from './SenderContactInformation';
import { SenderCountryCode } from './SenderCountryCode';

export interface SenderInformation {
  senderNameCompany: string | null;
  senderNamePerson: string | null;
  senderStreet: string | null;
  senderPostcode: string | null;
  senderCity: string | null;
  senderCountryCode: SenderCountryCode;
  senderContactInformation: SenderContactInformation;
}
