/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { CountryCode } from '../enums/CountryCode';

export interface Location {
    id: number | null;
    name: string;
    street: string;
    postcode: string;
    city: string;
    countryCode: CountryCode;
    officeNumber: string | null;
}