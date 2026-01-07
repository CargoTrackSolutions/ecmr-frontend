/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    input,
    LOCALE_ID,
    model,
    Output,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Ecmr } from '../../../core/models/Ecmr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle } from '@angular/material/expansion';
import { formatDate, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EcmrDisplayInformationFieldComponent } from './ecmr-display-information-field/ecmr-display-information-field.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { EcmrStatus } from '../../../core/models/EcmrStatus';
import { EcmrStatusComponent } from '../../../shared/components/ecmr-status/ecmr-status.component';
import { EcmrTransportType } from '../../../core/models/EcmrTransportType';
import { EcmrService } from '../../../shared/services/ecmr.service';
import { LogisticsShippingMarksCustomBarcode } from '../../../core/models/areas/ten/LogisticsShippingMarksCustomBarcode';
import { Item } from '../../../core/models/compositions/Item';
import { SealMetadata } from '../../../core/models/SealMetadata';
import { TransportRole } from '../../../core/models/TransportRole';
import { SealMetadataRolePipe } from '../../../core/pipes/seal-metadata-role.pipe';
import { FileDropZoneDirective } from '../../../shared/directives/file-drop-zone.directive';
import { handleAutoChangeDetectionStatus } from '@angular/cdk/testing';
import { DocumentModel } from '../../../core/models/DocumentModel';
import { FileSizePipe } from '../../../core/pipes/file-size.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-ecmr-overview-details',
    imports: [
        MatCard,
        MatCardContent,
        MatIcon,
        MatFormFieldModule,
        MatExpansionModule,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        TranslateModule,
        NgTemplateOutlet,
        EcmrDisplayInformationFieldComponent,
        MatIconButton,
        MatToolbar,
        MatToolbarRow,
        EcmrStatusComponent,
        SealMetadataRolePipe,
        FileDropZoneDirective,
        FileSizePipe,
        MatTooltip,
        MatTooltip
    ],
    templateUrl: './ecmr-overview-details.component.html',
    styleUrl: './ecmr-overview-details.component.scss'
})
export class EcmrOverviewDetailsComponent {

    locale = inject(LOCALE_ID);
    private ecmrService = inject(EcmrService);

    isTemplate: boolean = false;

    isHovering: WritableSignal<boolean> = signal<boolean>(false);
    invalidFiles: WritableSignal<number> = signal<number>(0);
    fileHoverAmount: WritableSignal<number> = signal<number>(0);

    constructor() {
        const route = inject(ActivatedRoute);

        if (route.snapshot.url.join('/').includes('templates-overview')) {
            this.isTemplate = true;
        }
    }

    readonly selectedEcmr = model.required<Ecmr>();
    readonly documents = model.required<DocumentModel[]>();
    readonly selectedSealMetadata = input<SealMetadata[]>();
    readonly quickViewButtons = input<TemplateRef<object>>();
    readonly mobileQuickViewButtons = input<TemplateRef<object>>();

    @Output() closeDetails = new EventEmitter();
    @Output() uploadFiles = new EventEmitter<File[]>();
    @Output() downloadDocument = new EventEmitter<DocumentModel>();
    @ViewChild('documentTitle') documentTitle: ElementRef<HTMLElement>;
    readonly isMobile = input<boolean>();


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
        if (barcodes == null) return [];
        return barcodes?.map(item => item.barcode);
    }


    public getTransportType(ecmr: Ecmr): EcmrTransportType | null {
        return this.ecmrService.getTransportType(ecmr);
    }

    public getTotalItemCount(itemList: Item[]): number | null {
        let count = 0;
        for (const item of itemList) {
            if (item.numberOfPackages.logisticsPackageItemQuantity != null) {
                count += item.numberOfPackages.logisticsPackageItemQuantity;
            }
        }
        return count;
    }

    protected readonly EcmrTransportType = EcmrTransportType;
    protected readonly EcmrStatus = EcmrStatus;
    protected readonly TransportRole = TransportRole;

    protected filesDropped($event: File[]) {
        console.log($event);
    }

    protected readonly handleAutoChangeDetectionStatus = handleAutoChangeDetectionStatus;

    fileNameHasEnding(document: DocumentModel, fileEndings: string[]): boolean {
        return fileEndings.some(ending => document.fileName.toLowerCase().endsWith(ending.toLowerCase()));
    }

    scrollToDocuments() {
        this.documentTitle.nativeElement.scrollIntoView({behavior: 'smooth'});
    }
}
