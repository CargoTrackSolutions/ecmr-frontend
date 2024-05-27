/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {SuccessiveCarrierCity} from "./SuccessiveCarrierCity";
import {SuccessiveCarrierCountry} from "./SuccessiveCarrierCountry";
import {SuccessiveCarrierName} from "./SuccessiveCarrierName";
import {SuccessiveCarrierPersonName} from "./SuccessiveCarrierPersonName";
import {SuccessiveCarrierPostcode} from "./SuccessiveCarrierPostcode";
import {SuccessiveCarrierSignature} from "./SuccessiveCarrierSignature";
import {SuccessiveCarrierSignatureDate} from "./SuccessiveCarrierSignatureDate";
import {SuccessiveCarrierStreetName} from "./SuccessiveCarrierStreetName";

export interface SuccessiveCarriers {
  successiveCarrierCity: SuccessiveCarrierCity;
  successiveCarrierCountry: SuccessiveCarrierCountry;
  successiveCarrierName: SuccessiveCarrierName;
  successiveCarrierPersonName: SuccessiveCarrierPersonName;
  successiveCarrierPostcode: SuccessiveCarrierPostcode;
  successiveCarrierSignature: SuccessiveCarrierSignature;
  successiveCarrierSignatureDate: SuccessiveCarrierSignatureDate;
  successiveCarrierStreetName: SuccessiveCarrierStreetName;

}
