/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Pipe, PipeTransform } from '@angular/core';
import { SealMetadata } from '../models/SealMetadata';
import { TransportRole } from '../models/TransportRole';

@Pipe({
    name: 'sealMetadataRole'
})
export class SealMetadataRolePipe implements PipeTransform {

    transform(sealMetadata: SealMetadata[] | undefined, role: TransportRole): SealMetadata | null {
        return sealMetadata ? (sealMetadata.find(x => x.role === role) ?? null) : null;
    }

}
