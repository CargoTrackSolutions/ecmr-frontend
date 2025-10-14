/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output, TemplateRef } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle } from '@angular/material/expansion';
import { formatDate, NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EcmrDisplayInformationFieldComponent } from './ecmr-display-information-field/ecmr-display-information-field.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { EcmrStatusComponent } from '../../../shared/components/ecmr-status/ecmr-status.component';
import { EcmrTransportType } from '../../../core/models/EcmrTransportType';
import { EcmrService } from '../../../shared/services/ecmr.service';
import { LogisticsShippingMarksCustomBarcode } from '../../../core/models/areas/ten/LogisticsShippingMarksCustomBarcode';
import { SealedDocumentWithoutEcmr } from '../../../core/models/SealedDocumentWithoutEcmr';
import { Item } from '../../../core/models/compositions/Item';

@Component({
    selector: 'app-ecmr-overview-details',
    standalone: true,
    imports: [
        MatCard,
        MatCardContent,
        MatIcon,
        MatFormFieldModule,
        MatExpansionModule,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
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
    @Input() currentSealedDocument!: SealedDocumentWithoutEcmr | null;

    @Input() quickViewButtons: TemplateRef<object>;
    @Input() mobileQuickViewButtons!: TemplateRef<object>;

    @Output() closeDetails = new EventEmitter();
    @Input() isMobile!: boolean;


    closeDetailsView() {
        this.closeDetails.emit(true);
    }

    toDateString(logisticsTimeOfArrivalDateTime: Date | null | undefined) {
        if (logisticsTimeOfArrivalDateTime)
            return formatDate(logisticsTimeOfArrivalDateTime, 'dd.MM.yyyy HH:mm', this.locale)
        else
            return ''
    }

    mapToStringArray(barcodes: LogisticsShippingMarksCustomBarcode[] | null) {
        if(barcodes == null) return [];
        return barcodes?.map(item => item.barcode);
    }


    public getTransportType(ecmr: Ecmr): EcmrTransportType | null {
        return this.ecmrService.getTransportType(ecmr);
    }

    public getTotalItemCount(itemList: Item[]): number | null {
        var count = 0;
        for(const item of itemList){
            if(item.numberOfPackages.logisticsPackageItemQuantity != null)  {
                count += item.numberOfPackages.logisticsPackageItemQuantity;
            }
        }
        return count;
    }

    protected readonly EcmrTransportType = EcmrTransportType;

    protected readonly EcmrStatus = EcmrStatus;
}
