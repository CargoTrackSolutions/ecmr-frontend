/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export interface ShowColumns {
    id: boolean;
    ecmrId: boolean;
    referenceId: boolean;
    from: boolean;
    to: boolean;
    transportType: boolean;
    lastEditor: boolean;
    status: boolean;
    lastEditDate: boolean;
    creationDate: boolean;
    licensePlate: boolean;
    carrierName: boolean;
    carrierPostCode: boolean;
    consigneePostCode: boolean;
}
