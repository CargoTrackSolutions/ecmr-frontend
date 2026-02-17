/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ActionType } from '../enums/ActionType';
import { EcmrRole } from '../enums/EcmrRole';

export interface HistoryLog {
    actionFrom: string;
    actionType: ActionType;
    timestamp: Date;
    shareRole: EcmrRole | null;
    shareWith: string | null;
}