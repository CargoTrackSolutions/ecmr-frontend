/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { PayerType } from '../../../enums/PayerType';

export interface CustomCharge {
    value: number | null;
    currency: string | null;
    payer: PayerType | null;
}