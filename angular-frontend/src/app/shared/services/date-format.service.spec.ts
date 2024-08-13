/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { DateFormatService } from './date-format.service';

describe('DateFormatService', () => {
    let service: DateFormatService;

  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(DateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
