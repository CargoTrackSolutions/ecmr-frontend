/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';

import { TemplateOverviewService } from './template-overview.service';
import { HttpClientModule } from '@angular/common/http';

describe('TemplateOverviewService', () => {
  let service: TemplateOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TemplateOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
