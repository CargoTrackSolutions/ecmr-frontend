/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, Signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { CountdownComponent } from './countdown/countdown.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { EcmrImportService } from '../../shared/services/ecmr-import.service';
import { ApprovedUrlService } from '../../shared/services/approved-url.service';
import { ApprovedUrl } from '../../core/models/Approved-Url/ApprovedUrl';
import { EcmrImport } from '../../core/models/EcmrImport';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-pending-ecmr',
    imports: [
        MatToolbar,
        TranslatePipe,
        CountdownComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        DatePipe,
        MatButton,
        RouterLink,
        MatIcon
    ],
    templateUrl: './pending-ecmr.component.html',
    styleUrl: './pending-ecmr.component.scss'
})
export class PendingEcmrComponent {

    private readonly ecmrImportService: EcmrImportService = inject(EcmrImportService);
    private readonly approvedUrlService: ApprovedUrlService = inject(ApprovedUrlService);

    approvedUrls: Signal<ApprovedUrl[]> = toSignal(this.approvedUrlService.getApprovedUrls(), {initialValue: [] as ApprovedUrl[]});
    ecmrImports: Signal<EcmrImport[]> = toSignal(this.ecmrImportService.getEcmrImports(), {initialValue: [] as EcmrImport[]});

    protected missingApproval(ecmr: EcmrImport) {
        return this.approvedUrls().filter(app => app.url === ecmr.instanceUrl).length === 0
    }
}
