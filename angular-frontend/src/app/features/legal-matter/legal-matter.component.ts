/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Component, OnInit} from '@angular/core';
import {MatLabel} from "@angular/material/form-field";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-legal-matter',
  standalone: true,
  imports: [
    MatLabel,
    MatToolbar,
    MatToolbarRow,
    TranslateModule
  ],
  templateUrl: './legal-matter.component.html',
  styleUrl: './legal-matter.component.scss'
})
export class LegalMatterComponent implements OnInit {

  imprintText: string;

  constructor(private http: HttpClient, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(data => {
      this.setText(data.lang);
    })
    this.setText(this.translateService.currentLang);
  }

  setText(lang: string): void {
    const path = `assets/texts/imprint.${lang}.html`
    this.http.get(path, {responseType: 'text'})
      .subscribe(data => {
        this.imprintText = data;
      });
  }

}
