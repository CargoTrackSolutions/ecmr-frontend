/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { CountryCode } from '../enums/CountryCode';
import { UserRole } from '../enums/UserRole';

export interface EcmrUser {
    id: number | null,
    firstName: string,
    lastName: string,
    country: CountryCode,
    email: string,
    phone: string | null,
    companyName: string | null,
    role: UserRole,
    defaultGroupId: number | null
    deactivated: boolean;
}
