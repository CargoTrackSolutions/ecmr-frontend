/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOverviewComponent } from './user-overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';

describe('UserOverviewComponent', () => {
    let component: UserOverviewComponent;
    let fixture: ComponentFixture<UserOverviewComponent>;
    let mockAuthService;


    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getAuthenticatedUser']);
        mockAuthService.getAuthenticatedUser.and.returnValue(of(null));
        await TestBed.configureTestingModule({
            imports: [
                UserOverviewComponent,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
            ],
            providers: [
                {provide: AuthService, useValue: mockAuthService},
                {provide: OAuthService, useValue: {}},
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UserOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
