/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, TemplateRef } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatList, MatListItem } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle } from '@angular/material/expansion';
import { formatDate, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EcmrDisplayInformationFieldComponent } from './ecmr-display-information-field/ecmr-display-information-field.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'app-ecmr-overview-details',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatFormFieldModule,
    MatInput,
    MatExpansionModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    NgOptimizedImage,
    NgIf,
    TranslateModule,
    NgTemplateOutlet,
    EcmrDisplayInformationFieldComponent,
    MatIconButton,
    MatToolbar,
    MatToolbarRow
  ],
  templateUrl: './ecmr-overview-details.component.html',
  styleUrl: './ecmr-overview-details.component.scss'
})
export class EcmrOverviewDetailsComponent {

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

  @Input() selectedEcmr!: Ecmr;

  @Input() quickViewButtons: TemplateRef<object>;
    @Input() mobileQuickViewButtons!: TemplateRef<object>;

  @Output() closeDetails = new EventEmitter();
    @Input() isMobile!: boolean;

  closeDetailsView() {
    this.closeDetails.emit(true);
  }

  toDateString(logisticsTimeOfArrivalDateTime: Date | null) {
    if (logisticsTimeOfArrivalDateTime)
      return formatDate(logisticsTimeOfArrivalDateTime, 'dd.MM.yyyy hh:mm', this.locale)
    else
      return ''
  }
}
