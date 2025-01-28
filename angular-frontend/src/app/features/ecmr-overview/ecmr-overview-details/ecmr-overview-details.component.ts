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
import { ActivatedRoute } from '@angular/router';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { EcmrStatusComponent } from '../../../shared/components/ecmr-status/ecmr-status.component';
import { EcmrTransportType } from '../../../core/models/EcmrTransportType';
import { EcmrService } from '../../../shared/services/ecmr.service';
import { SignatureType } from '../../../core/models/SignatureType';

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
        MatToolbarRow,
        EcmrStatusComponent
    ],
    templateUrl: './ecmr-overview-details.component.html',
    styleUrl: './ecmr-overview-details.component.scss'
})
export class EcmrOverviewDetailsComponent {
    isTemplate: boolean = false;

    constructor(@Inject(LOCALE_ID) public locale: string, route: ActivatedRoute, private ecmrService: EcmrService) {
        if (route.snapshot.url.join('/').includes('templates-overview')) {
            this.isTemplate = true;
        }
    }

    @Input() selectedEcmr!: Ecmr;

    @Input() quickViewButtons: TemplateRef<object>;
    @Input() mobileQuickViewButtons!: TemplateRef<object>;

    @Output() closeDetails = new EventEmitter();
    @Input() isMobile!: boolean;


    closeDetailsView() {
        this.closeDetails.emit(true);
    }

    toDateString(logisticsTimeOfArrivalDateTime: Date | null | undefined) {
        if (logisticsTimeOfArrivalDateTime)
            return formatDate(logisticsTimeOfArrivalDateTime, 'dd.MM.yyyy hh:mm', this.locale)
        else
            return ''
    }


  public getTransportType(ecmr: Ecmr): EcmrTransportType | null {
    return this.ecmrService.getTransportType(ecmr);
  }

    protected readonly EcmrTransportType = EcmrTransportType;

    protected readonly EcmrStatus = EcmrStatus;
    protected readonly SignatureType = SignatureType;
}
