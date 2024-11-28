/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { EcmrService } from './ecmr.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EcmrService', () => {
  let service: EcmrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [EcmrService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EcmrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
