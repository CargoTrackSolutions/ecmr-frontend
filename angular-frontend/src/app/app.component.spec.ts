/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { TestBed } from '@angular/core/testing';
import { AppComponent, HttpLoaderFactory } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';

describe('AppComponent', () => {

  let oauthServiceMock: jasmine.SpyObj<OAuthService>;

  beforeEach(async () => {
    const mockOAuthSuccessEvent: OAuthSuccessEvent = {
      type: 'discovery_document_loaded',
      info: null
    };
    oauthServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'configure', 'loadDiscoveryDocument', 'hasValidAccessToken', 'setupAutomaticSilentRefresh', 'initLogin', 'login', 'hasRole', 'setStorage', 'getCompositeRoles', 'getAuthenticatedUser']);
    oauthServiceMock.loadDiscoveryDocument.and.returnValue(Promise.resolve(mockOAuthSuccessEvent));

    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule, RouterModule.forRoot(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),],
      providers: [
        {provide: OAuthService, useValue: oauthServiceMock},
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-frontend');
  });
});
