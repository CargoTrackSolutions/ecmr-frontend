/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
