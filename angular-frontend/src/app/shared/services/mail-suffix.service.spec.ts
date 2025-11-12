/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { MailSuffixService } from './mail-suffix.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MailSuffixService', () => {
    let service: MailSuffixService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MailSuffixService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(MailSuffixService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
