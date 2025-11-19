/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { SealMetadata } from '../../../core/models/SealMetadata';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { Ecmr } from '../../../core/models/Ecmr';

export interface ShareEcmrDialogData {
    ecmr: Ecmr;
    sealMetadata: SealMetadata[];
    roles: EcmrRole[];
    isExternalUser: boolean;
    userToken: string;
    tan: string;
}