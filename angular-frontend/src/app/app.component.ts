/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './core/services/theme.service';
import { EcmrIconComponent } from './shared/ecmr-icons/ecmr-icon/ecmr-icon.component';
import { EcmrDoneIconComponent } from './shared/ecmr-icons/ecmr-done-icon/ecmr-done-icon.component';
import { EcmrTemplateIconComponent } from './shared/ecmr-icons/ecmr-template-icon/ecmr-template-icon.component';
import { CommonModule } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { LoadingService } from './core/services/loading.service';
import { AuthenticatedUser } from './core/models/AuthenticatedUser';
import { AuthService } from './core/services/auth.service';
import { UserRole } from './core/enums/UserRole';
import { MatTooltip } from '@angular/material/tooltip';
import { CapabilitiesService } from './core/services/capabilities-service';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatToolbarModule, MatDrawerContainer, MatDrawer, MatButtonModule, MatSidenavModule, FormsModule, MatCheckboxModule, MatIconModule, EcmrIconComponent, EcmrDoneIconComponent, EcmrTemplateIconComponent, RouterLink, RouterLinkActive, CommonModule, MatRipple, TranslateModule, LoadingOverlayComponent, MatTooltip],
    providers: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    private breakpointObserver = inject(BreakpointObserver);
    private router = inject(Router);
    private themeService = inject(ThemeService);
    private loadingService = inject(LoadingService);
    authService = inject(AuthService);
    private translate = inject(TranslateService);
    private readonly capabilitiesService = inject(CapabilitiesService);

    title = 'angular-frontend';
    languages = [
        {flag: '🇩🇪', code: 'de'},
        {flag: '🇬🇧', code: 'en'},
        {flag: '🇪🇸', code: 'es'},
        {flag: '🇫🇷', code: 'fr'},
        {flag: '🇮🇹', code: 'it'},
        {flag: '🇵🇱', code: 'pl'},
        {flag: '🇸🇰', code: 'sk'},
        {flag: '🇨🇿', code: 'cs'}
    ];
    selectedLanguage: { flag: string, code: string };
    languagePickerExtended: boolean = false;

    isMobile: boolean = false;
    private breakpointSubscription: Subscription | undefined;

    isDarkMode: boolean = false;

    loading$: Observable<boolean>;

    @ViewChild('drawer') drawer: MatDrawer;
    authenticatedUser: AuthenticatedUser | null;

    constructor() {

        const storedLanguageCode = localStorage.getItem('selectedLanguage') || 'en';
        this.selectedLanguage = this.languages.find(lang => lang.code === storedLanguageCode) || this.languages[1];
        this.translate.use(this.selectedLanguage.code);

        this.loading$ = this.loadingService.isLoading$;

        this.capabilitiesService.load(this.authService.getAuthenticatedUser())
            .subscribe(user => {
                this.authenticatedUser = user;
            });
    }

    ngOnInit() {
        this.isDarkMode = this.themeService.isDarkMode();

        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe(result => {
                this.isMobile = result.matches;
            });
    }

    ngOnDestroy() {
        if (this.breakpointSubscription) {
            this.breakpointSubscription.unsubscribe();
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.themeService.toggleDarkMode(this.isDarkMode);
    }

    navigateTo(url: string) {
        this.router.navigateByUrl(url);
        this.drawer.close();
    }

    toggleLanguagePicker(): void {
        this.languagePickerExtended = !this.languagePickerExtended;
    }

    selectLanguage(language: { flag: string, code: string }): void {
        this.selectedLanguage = language;
        this.languagePickerExtended = false;
        localStorage.setItem('selectedLanguage', this.selectedLanguage.code);
        this.translate.use(this.selectedLanguage.code);
    }

    stringToColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs((hash % 360) + (hash >> 3) % 60);
        const s = Math.abs(((hash >> 8) % 30) + 70);
        const l = Math.abs(((hash >> 16) % 20) + 50);
        return `hsl(${h % 360}, ${s}%, ${l}%)`;
    }

    getInitialsOfAuthenticatedUser() {
        if (this.authenticatedUser?.user) {
            return this.authenticatedUser.user.firstName.charAt(0).toUpperCase() + this.authenticatedUser.user.lastName.charAt(0).toUpperCase();
        }
        return 'EU';
    }

    getNameOfAuthenticatedUser() {
        if (this.authenticatedUser?.user) {
            return this.authenticatedUser.user.firstName + " " + this.authenticatedUser.user.lastName;
        }
        return 'External User';
    }

    protected readonly UserRole = UserRole;

    logout() {
        this.authService.logout();
    }
}
