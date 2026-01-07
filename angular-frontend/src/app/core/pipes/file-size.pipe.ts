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
    name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

    transform(bytes: number): string {
        if(bytes > 1024 * 1024) {
            return (bytes / 1024 / 1024).toFixed(1) + " MB";
        }
        return (bytes / 1024).toFixed(1) + " KB";
    }

}
