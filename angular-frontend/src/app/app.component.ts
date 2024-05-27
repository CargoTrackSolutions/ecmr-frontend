/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatIconModule} from '@angular/material/icon';
import {ThemeService} from './core/services/theme.service';
import {EcmrIconComponent} from './shared/ecmr-icons/ecmr-icon/ecmr-icon.component';
import {EcmrDoneIconComponent} from './shared/ecmr-icons/ecmr-done-icon/ecmr-done-icon.component';
import {EcmrTemplateIconComponent} from './shared/ecmr-icons/ecmr-template-icon/ecmr-template-icon.component';
import {CommonModule} from '@angular/common';
import {MatRipple} from '@angular/material/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, MatDrawerContainer, MatDrawer, MatButtonModule, MatSidenavModule, FormsModule, MatCheckboxModule, MatIconModule, EcmrIconComponent, EcmrDoneIconComponent, EcmrTemplateIconComponent, RouterLink, RouterLinkActive, CommonModule, MatRipple],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'angular-frontend';

    isOpen = false;

    isMobile: boolean = false;
    private breakpointSubscription: Subscription | undefined;

    isDarkMode: boolean = false;

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private themeService: ThemeService) {
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
