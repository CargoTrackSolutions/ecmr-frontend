/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Group } from './Group';

export interface FlatGroupNode {
    expandable: boolean;
    name: string;
    group: Group;
    level: number;
}