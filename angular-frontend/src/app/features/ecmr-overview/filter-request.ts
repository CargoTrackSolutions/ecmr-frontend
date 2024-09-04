/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { EcmrStatus } from '../../core/models/EcmrStatus';
import { EcmrTransportType } from '../../core/models/EcmrTransportType';

export interface FilterRequest {
    referenceId: string | null,
    from: string | null,
    to: string | null,
    transportType: EcmrTransportType | null,
    status: EcmrStatus | null,
    licensePlate: string | null,
    carrierName: string | null,
    carrierPostCode: string | null,
    consigneePostCode: string | null,
    lastEditor: string | null,
}
