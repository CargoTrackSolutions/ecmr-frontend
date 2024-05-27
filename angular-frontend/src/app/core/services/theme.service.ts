/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = false;

  lightTheme = 'light-theme';
  darkTheme = 'dark-theme';

  constructor() {
    const localTheme = localStorage.getItem('theme');
    if (!localTheme) {
      this.toggleDarkMode(false);
    } else {
      localTheme == this.lightTheme ? this.toggleDarkMode(false) : this.toggleDarkMode(true);
    }
  }

  isDarkMode() {
    return this.darkMode;
  }

  toggleDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', this.darkTheme);
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', this.lightTheme);
    }
  }
}
