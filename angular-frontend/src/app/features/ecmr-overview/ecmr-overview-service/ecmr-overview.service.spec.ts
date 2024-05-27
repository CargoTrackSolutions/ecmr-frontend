/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {TestBed} from '@angular/core/testing';

import {EcmrOverviewService} from './ecmr-overview.service';

describe('EcmrOverviewService', () => {
  let service: EcmrOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcmrOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
