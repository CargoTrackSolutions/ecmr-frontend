/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { EcmrRole } from '../enums/EcmrRole';

export interface EcmrShareWithGroup {
    groupId: number,
    role: EcmrRole
}