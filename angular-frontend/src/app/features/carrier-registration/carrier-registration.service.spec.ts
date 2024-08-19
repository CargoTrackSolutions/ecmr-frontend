/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { CarrierRegistrationService } from './carrier-registration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CarrierRegistrationService', () => {
    let service: CarrierRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CarrierRegistrationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
