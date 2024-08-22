/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../models/AuthenticatedUser';
import { UserService } from '../../shared/services/user.service';
import { UserRole } from '../enums/UserRole';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authenticatedUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);
    private authStatus = new BehaviorSubject<boolean>(false);

    constructor(private oauthService: OAuthService, private httpClient: HttpClient, private userService: UserService, private router: Router) {
        this.oauthService.setStorage(localStorage);
        this.oauthService.configure(environment.authConfig);
        this.oauthService.loadDiscoveryDocument()
            .then(() => this.oauthService.setupAutomaticSilentRefresh())
        this.isAuthenticated();
    }

    public isAuthenticated(): boolean {
        const isValid = this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
        this.authStatus.next(isValid);
        return isValid;
    }

    public getAuthStatus$(): Observable<boolean> {
        return this.authStatus.asObservable();
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

    public logout() {
        this.oauthService.logOut();
    }

    // eslint-disable-next-line
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!this.isAuthenticated()) {
            this.initLogin(window.location.pathname);
            return of(false);
        }

        const requiredRole: UserRole | undefined | null = route.data['role'];
        return this.getAuthenticatedUser().pipe(
            map(authenticatedUser => {
                if(authenticatedUser == null) {
                    this.router.navigateByUrl('/no-user');
                    return false;
                }
                if(requiredRole && !this.hasRole(authenticatedUser, requiredRole)) {
                    this.router.navigateByUrl('/no-permission');
                    return false;
                }
                return true;
            })
        );
    }

    public hasRole(authenticatedUser: AuthenticatedUser | null, role: UserRole):boolean {
        if(!authenticatedUser) {
            return false;
        }
        return this.getCompositeRoles(authenticatedUser.user.role).includes(role);
    }

    private getCompositeRoles(role: UserRole): UserRole[] {
        if (role == UserRole.User) {
            return [UserRole.User];
        } else if(role == UserRole.Admin) {
            return [UserRole.Admin, UserRole.User];
        }
        return [];
    }

    public getAuthenticatedUser(): Observable<AuthenticatedUser | null> {
        return this.getAuthStatus$().pipe(
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
                    return of(null);
                }

                if (this.authenticatedUserSubject.value == null) {
                    return this.userService.getCurrentUser().pipe(
                        tap(authenticatedUser => this.authenticatedUserSubject.next(authenticatedUser)),
                        catchError(() => of(null))
                    );
                }
                return of(this.authenticatedUserSubject.value);
            })
        );
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    return inject(AuthService).canActivate(next, state);
}
