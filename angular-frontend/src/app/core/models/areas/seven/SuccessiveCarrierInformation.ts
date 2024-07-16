/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Signature } from '../signature/Signature';
import { SuccessiveCarrierContactInformation } from './SuccessiveCarrierContactInformation';
import { SuccessiveCarrierCountryCode } from './SuccessiveCarrierCountryCode';

export interface SuccessiveCarrierInformation {
  successiveCarrierCity: string | null;
  successiveCarrierCountryCode: SuccessiveCarrierCountryCode;
  successiveCarrierNameCompany: string | null;
  successiveCarrierNamePerson: string | null;
  successiveCarrierPostcode: string | null;
  successiveCarrierSignature: Signature | null;
  successiveCarrierSignatureDate: Date | null;
  successiveCarrierStreet: string | null;
  successiveCarrierContactInformation: SuccessiveCarrierContactInformation;
}
