/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrDisplayInformationFieldComponent } from './ecmr-display-information-field.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../../app.component';

describe('EcmrDisplayInformationFieldComponent', () => {
    let component: EcmrDisplayInformationFieldComponent;
    let fixture: ComponentFixture<EcmrDisplayInformationFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EcmrDisplayInformationFieldComponent, HttpClientModule, TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            })],
            providers: [
                TranslateService
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EcmrDisplayInformationFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
