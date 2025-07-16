/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export interface Signature {
  userName: string;
  userCompany: string;
  userStreet: string;
  userPostCode: string;
  userCity: string;
  userCountry: string;
  timestamp: Date; // must be used with a DatePipe
  data: string;
}
