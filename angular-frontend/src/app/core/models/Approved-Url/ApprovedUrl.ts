/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { EcmrUser } from '../EcmrUser';

export interface ApprovedUrl {
    id: number;
    url: string;
    approvedState: boolean;
    creationTimestamp: Date;
    updateTimestamp: Date;
    lastUpdateUser: EcmrUser
}