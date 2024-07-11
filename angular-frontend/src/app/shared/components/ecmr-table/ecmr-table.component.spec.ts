/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EcmrTableComponent} from './ecmr-table.component';
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../../../app.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('EcmrTableComponent', () => {
  let component: EcmrTableComponent;
  let fixture: ComponentFixture<EcmrTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EcmrTableComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EcmrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show ecmr details', () => {
    component.showDetailsForEcmrAtIndex(1)
    expect(component.showDetails).toBeTrue()

    component.closeDetailsView()
    expect(component.showDetails).toBeFalse()
  });

  it('should hide columns', () => {
    expect(component.toggledColumns[0]).toBeTrue()
    component.toggleColumnAtIndex(0)
    expect(component.toggledColumns[0]).toBeFalse()

    const displayedCols = component.displayedColumns.length
    component.updateColumns()
    expect(component.columns.length > displayedCols).toBeTrue()
  });
});
