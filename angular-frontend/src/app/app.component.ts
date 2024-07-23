/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
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


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, MatDrawerContainer, MatDrawer, MatButtonModule, MatSidenavModule, FormsModule, MatCheckboxModule, MatIconModule, EcmrIconComponent, EcmrDoneIconComponent, EcmrTemplateIconComponent, RouterLink, RouterLinkActive, CommonModule, MatRipple, TranslateModule, HttpClientModule, LoadingOverlayComponent],
    providers: [HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'angular-frontend';
    actualLanguage = 'DE';
    isOpen = false;

    isMobile: boolean = false;
    private breakpointSubscription: Subscription | undefined;

    isDarkMode: boolean = false;

    loading$: Observable<boolean>;

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private themeService: ThemeService,
                private loadingService: LoadingService,
                private translate: TranslateService) {
        translate.setDefaultLang('en');
        this.loading$ = this.loadingService.isLoading$;
    }

    ngOnInit() {
      this.isDarkMode = this.themeService.isDarkMode();

        this.breakpointSubscription = this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
        ]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

  changeLanguage() {
    if (this.actualLanguage === 'EN') {
      this.translate.use('de');
      this.actualLanguage = 'DE';
    } else if (this.actualLanguage === 'DE') {
      this.translate.use('en');
      this.actualLanguage = 'EN';
    }
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
        this.router.navigateByUrl(url)
    }
}
