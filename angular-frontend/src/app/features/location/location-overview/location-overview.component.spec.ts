/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationOverviewComponent } from './location-overview.component';
import { LocationService } from '../location-service/location.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LocationAdminComponent', () => {
  let component: LocationOverviewComponent;
  let fixture: ComponentFixture<LocationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationOverviewComponent, HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      })],
      providers: [
        LocationService,
        TranslateService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
