/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { EcmrService } from './ecmr.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('EcmrService', () => {
  let service: EcmrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EcmrService]
    });
    service = TestBed.inject(EcmrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
