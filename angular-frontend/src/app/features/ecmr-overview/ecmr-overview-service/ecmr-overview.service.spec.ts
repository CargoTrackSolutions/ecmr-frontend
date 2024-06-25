/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {TestBed} from '@angular/core/testing';

import {EcmrOverviewService} from './ecmr-overview.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EcmrOverviewService', () => {
  let service: EcmrOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EcmrOverviewService]
    });
    service = TestBed.inject(EcmrOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
