/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { EcmrConsignment } from './EcmrConsignment';
import { EcmrStatus } from './EcmrStatus';

export interface Ecmr {
    ecmrId: string | null;
    ecmrConsignment: EcmrConsignment;
    ecmrStatus?: EcmrStatus;
    createdAt?: Date;
    createdBy?: string;
    editedAt?: Date;
    editedBy?: string;
}
