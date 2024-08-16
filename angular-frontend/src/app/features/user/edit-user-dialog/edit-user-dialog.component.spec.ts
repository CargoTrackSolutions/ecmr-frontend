/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDialogComponent } from './edit-user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';

describe('EditUserDialogComponent', () => {
    let component: EditUserDialogComponent;
    let fixture: ComponentFixture<EditUserDialogComponent>;
    let oauthServiceMock: jasmine.SpyObj<OAuthService>;

    beforeEach(async () => {
        const mockOAuthSuccessEvent: OAuthSuccessEvent = {
            type: 'discovery_document_loaded',
            info: null
        };

        oauthServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'configure', 'loadDiscoveryDocument', 'hasValidAccessToken', 'setupAutomaticSilentRefresh', 'initLogin', 'login', 'hasRole', 'setStorage', 'getCompositeRoles', 'getAuthenticatedUser']);
        oauthServiceMock.loadDiscoveryDocument.and.returnValue(Promise.resolve(mockOAuthSuccessEvent));

        await TestBed.configureTestingModule({
            imports: [EditUserDialogComponent,
                MatDialogModule,
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
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {}},
                {provide: OAuthService, useValue: oauthServiceMock},
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
