/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalUserRegistrationSuccessComponent } from './external-user-registration-success.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalUserService } from '../../ecmr-editor/ecmr-editor-service/external-user.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CarrierRegistrationSuccessComponent', () => {
    let component: ExternalUserRegistrationSuccessComponent;
    let fixture: ComponentFixture<ExternalUserRegistrationSuccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [ExternalUserRegistrationSuccessComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule],
    providers: [
        { provide: ExternalUserService, useValue: {} },
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ id: 'someId' })
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
            .compileComponents();

        fixture = TestBed.createComponent(ExternalUserRegistrationSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
