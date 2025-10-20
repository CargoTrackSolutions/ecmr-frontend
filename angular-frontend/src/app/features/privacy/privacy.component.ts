/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-privacy',
    imports: [
        MatLabel,
        MatToolbar,
        MatToolbarRow,
        TranslateModule
    ],
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss'
})
export class PrivacyComponent implements OnInit {
    private http = inject(HttpClient);
    private translateService = inject(TranslateService);


  privacyText: string;

  ngOnInit() {
    this.translateService.onLangChange.subscribe(data => {
      this.setText(data.lang);
    })
    this.setText(this.translateService.currentLang);
  }

  setText(lang: string): void {
    const path = `assets/texts/privacy.${lang}.html`
    this.http.get(path, {responseType: 'text'})
      .subscribe(data => {
        this.privacyText = data;
      });
  }

}
