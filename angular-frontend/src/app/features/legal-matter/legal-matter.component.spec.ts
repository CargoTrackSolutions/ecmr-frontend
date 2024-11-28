/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMatterComponent } from './legal-matter.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app.component";
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe('LegalMatterComponent', () => {
  let component: LegalMatterComponent;
  let fixture: ComponentFixture<LegalMatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LegalMatterComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(LegalMatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
