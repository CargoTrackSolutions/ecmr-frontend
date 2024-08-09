/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { FormControl } from '@angular/forms';
import { Group } from '../../core/models/Group';

export interface GroupFormGroup {
    group: FormControl<Group | null>;
}