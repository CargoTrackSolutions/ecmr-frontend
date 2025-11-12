/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { EcmrImportService } from './ecmr-import.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EcmrImportService', () => {
    let service: EcmrImportService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcmrImportService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(EcmrImportService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
