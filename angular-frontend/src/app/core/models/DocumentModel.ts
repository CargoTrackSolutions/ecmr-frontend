/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export interface DocumentModel {
    id: number;
    fileName: string;
    mimeType: string;
    uploadDate: string;
    size: number;
}