/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private oauthService: OAuthService, private httpClient: HttpClient, private router: Router) {
        this.oauthService.setStorage(localStorage);
        this.oauthService.configure(environment.authConfig);
        this.oauthService.loadDiscoveryDocument()
            .then(() => this.oauthService.setupAutomaticSilentRefresh())
    }

    public isAuthenticated(): boolean {
        return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
    }

    public initLogin(redirectUrl: string | null = null): void {
        redirectUrl = redirectUrl ? redirectUrl : '/';
        this.oauthService.loadDiscoveryDocument().then(() =>
            this.oauthService.initCodeFlow('entrypoint=' + redirectUrl)
        );
    }

    public login(): Observable<boolean> {
        return from(this.oauthService.loadDiscoveryDocumentAndTryLogin());
    }

    // eslint-disable-next-line
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!this.isAuthenticated()) {
            this.initLogin(window.location.pathname);
            return of(false);
        }

        return of(true);
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    return inject(AuthService).canActivate(next, state);
}
