/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { JsonImportExportService } from './json-import-export.service';

describe('JsonImportExportService', () => {
    let service: JsonImportExportService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JsonImportExportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
