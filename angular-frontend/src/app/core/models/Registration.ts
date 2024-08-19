/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export interface Registration {
    firstName: string,
    lastName: string,
    phone: string | null,
    email: string | null,
    company: string,
    ecmrId: string,
    shareToken: string
}