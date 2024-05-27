/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {CustomEstablishedDate} from "./CustomEstablishedDate";
import {CustomEstablishedIn} from "./CustomEstablishedIn";

export interface Established {
  customEstablishedDate: CustomEstablishedDate;
  customEstablishedIn: CustomEstablishedIn;
}
