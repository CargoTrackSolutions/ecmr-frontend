/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { LoadingService } from '../../core/services/loading.service';
import { EcmrService } from './ecmr.service';
import { Router } from '@angular/router';
import { ExternalUserService } from '../../features/ecmr-editor/ecmr-editor-service/external-user.service';

@Injectable({
    providedIn: 'root'
})
export class EcmrActionService {

    constructor(private loadingService: LoadingService,
                private ecmrService: EcmrService,
                private externalUserService: ExternalUserService,
                private router: Router) {
    }

    downloadPdf(ecmrId: string, tan: string | null, referenceId: string) {
        this.loadingService.showLoaderUntilCompleted(
            (tan ? this.externalUserService.downloadPdf(ecmrId, tan) :
                this.ecmrService.downloadPdf(ecmrId))
        ).subscribe((response: HttpResponse<Blob>) => {
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'ecmr-' + referenceId + '.pdf';

            if (contentDisposition) {
                const matches = /filename="([^"]*)"/.exec(contentDisposition);
                if (matches?.[1]) {
                    fileName = matches[1];
                }
            }
            if (response.body) {
                const file = new Blob([response.body], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = fileName;
                link.target = '_blank';
                link.click();
            }
        });
    }


    onCopyEcmr(ecmrId: string | null | undefined) {
        if (ecmrId) {
            this.router.navigateByUrl(`/ecmr-editor/${ecmrId}/copy`);
        }
    }
}
