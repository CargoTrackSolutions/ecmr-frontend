/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierRegistrationComponent } from './carrier-registration.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from '../../shared/services/user.service';

describe('CarrierRegistrationComponent', () => {
    let component: CarrierRegistrationComponent;
    let fixture: ComponentFixture<CarrierRegistrationComponent>;
    let mockAuthService;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getAuthenticatedUser']);
        mockAuthService.getAuthenticatedUser.and.returnValue(of(null));
        await TestBed.configureTestingModule({
    imports: [CarrierRegistrationComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule],
    providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: OAuthService, useValue: {} },
        { provide: UserService, useValue: {} },
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ id: 'someId' }) // Mock params observable with 'id'
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
            .compileComponents();

        fixture = TestBed.createComponent(CarrierRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
