/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, MatDrawerContainer, MatDrawer, MatButtonModule, MatSidenavModule, FormsModule, MatCheckboxModule, MatIconModule, EcmrIconComponent, EcmrDoneIconComponent, EcmrTemplateIconComponent, RouterLink, RouterLinkActive, CommonModule, MatRipple, TranslateModule, HttpClientModule, LoadingOverlayComponent, MatTooltip],
    providers: [HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'angular-frontend';
    languages = [
        {flag: '🇩🇪', code: 'de'},
        {flag: '🇬🇧', code: 'en'}
    ];
    selectedLanguage: { flag: string, code: string };
    languagePickerExtended: boolean = false;
    isOpen = false;

    isMobile: boolean = false;
    private breakpointSubscription: Subscription | undefined;

    isDarkMode: boolean = false;

    loading$: Observable<boolean>;

    @ViewChild('drawer') drawer: MatDrawer;
    authenticatedUser: AuthenticatedUser | null;

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private themeService: ThemeService,
                private loadingService: LoadingService,
                public authService: AuthService,
                private translate: TranslateService) {

        const storedLanguageCode = localStorage.getItem('selectedLanguage') || 'en';
        this.selectedLanguage = this.languages.find(lang => lang.code === storedLanguageCode) || this.languages[1];
        this.translate.use(this.selectedLanguage.code);

        this.loading$ = this.loadingService.isLoading$;
        this.authService.getAuthenticatedUser().subscribe(authenticatedUser => this.authenticatedUser = authenticatedUser);
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

    toggleMenu(): void {
        this.isOpen = !this.isOpen;
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.themeService.toggleDarkMode(this.isDarkMode);
    }

    navigateTo(url: string) {
        this.router.navigateByUrl(url);
        if (this.isOpen) this.toggleMenu();
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
        return 'XX';
    }

    getNameOfAuthenticatedUser() {
        if (this.authenticatedUser?.user) {
            return this.authenticatedUser.user.firstName + " " + this.authenticatedUser.user.lastName;
        }
        return 'Xxxxx Xxxxxx';
    }

    protected readonly UserRole = UserRole;
}
