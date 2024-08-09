/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { GroupFormGroup } from './GroupFormGroup';
import { Location } from '../../core/models/Location';
import { Group } from '../../core/models/Group';

export interface LocationFormGroup {
    location: FormControl<Location | null>;
    groupsList: FormControl<Group[] | null>
    groups: FormArray<FormGroup<GroupFormGroup>>;
}