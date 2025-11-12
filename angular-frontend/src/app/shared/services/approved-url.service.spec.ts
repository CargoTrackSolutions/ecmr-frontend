/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { ApprovedUrlService } from './approved-url.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ApprovedUrlService', () => {
    let service: ApprovedUrlService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ApprovedUrlService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ApprovedUrlService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
