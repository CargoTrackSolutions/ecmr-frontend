/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
