/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {SignatureType} from "../../SignatureType";

export interface Signature {
  type: SignatureType;
  userName: string;
  userCompany: string;
  userStreet: string;
  userPostCode: string;
  userCity: string;
  userCountry: string;
  timestamp: Date; // must be used with a DatePipe
  data: string;
}
