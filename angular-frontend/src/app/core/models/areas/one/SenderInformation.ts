/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {SenderNameCompany} from "./SenderNameCompany";
import {SenderNamePerson} from "./SenderNamePerson";
import {SenderStreet} from "./SenderStreet";
import {SenderPostcode} from "./SenderPostcode";
import {SenderCity} from "./SenderCity";
import {SenderCountryCode} from "./SenderCountryCode";

export interface SenderInformation {
  senderNameCompany: SenderNameCompany;
  senderNamePerson: SenderNamePerson;
  senderStreet: SenderStreet;
  senderPostcode: SenderPostcode;
  senderCity: SenderCity;
  senderCountry: SenderCountryCode;
}
