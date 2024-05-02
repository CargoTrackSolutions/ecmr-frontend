/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */
import {ConsigneeNameCompany} from "./ConsigneeNameCompany";
import {ConsigneeNamePerson} from "./ConsigneeNamePerson";
import {ConsigneePostcode} from "./ConsigneePostcode";
import {ConsigneeCity} from "./ConsigneeCity";
import {ConsigneeCountry} from "./ConsigneeCountry";

export interface ConsigneeInformation {
  consigneeNameCompany: ConsigneeNameCompany;
  consigneeNamePerson: ConsigneeNamePerson;
  consigneePostcode: ConsigneePostcode;
  consigneeCity: ConsigneeCity;
  consigneeCountry: ConsigneeCountry;
}
