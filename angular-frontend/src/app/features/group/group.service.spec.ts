/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GroupService', () => {
    let service: GroupService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(GroupService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
