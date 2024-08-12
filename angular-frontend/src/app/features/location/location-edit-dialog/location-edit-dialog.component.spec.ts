/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEditDialogComponent } from './location-edit-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocationService } from '../location-service/location.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LocationEditDialogComponent', () => {
  let component: LocationEditDialogComponent;
  let fixture: ComponentFixture<LocationEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LocationEditDialogComponent,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        LocationService,
        TranslateService
      ]
    })
        .compileComponents();

    fixture = TestBed.createComponent(LocationEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
