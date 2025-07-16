/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { SealedDocumentWithoutEcmr } from './SealedDocumentWithoutEcmr';
import { Ecmr } from './Ecmr';

export interface SealedDocument extends SealedDocumentWithoutEcmr {
    ecmr: Ecmr;
}
