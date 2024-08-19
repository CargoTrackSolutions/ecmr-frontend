/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierRegistrationSuccessComponent } from './carrier-registration-success.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EcmrTanService } from '../../ecmr-editor/ecmr-editor-service/ecmr-tan.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CarrierRegistrationSuccessComponent', () => {
    let component: CarrierRegistrationSuccessComponent;
    let fixture: ComponentFixture<CarrierRegistrationSuccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CarrierRegistrationSuccessComponent,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: EcmrTanService, useValue: {}},
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({id: 'someId'})
                    }
                },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CarrierRegistrationSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
