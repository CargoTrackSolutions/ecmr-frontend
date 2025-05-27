/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Group } from './Group';
import { ExternalUser } from './ExternalUser';
import { EcmrRole } from '../enums/EcmrRole';

export interface EcmrAssignment {
  ecmrId: string;
  group: Group;
  externalUser: ExternalUser;
  role: EcmrRole;
}
