/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TransportRole } from './TransportRole';

export interface SealMetadata {
    sealer: string;
    role: TransportRole;
    seal: string;
    timestamp: Date;
}
