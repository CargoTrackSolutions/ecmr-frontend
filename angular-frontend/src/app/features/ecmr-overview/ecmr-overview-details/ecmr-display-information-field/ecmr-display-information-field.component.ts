/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
    selector: 'app-ecmr-display-information-field',
    standalone: true,
    imports: [
        TranslateModule,
        MatChipSet,
        MatChip
    ],
    templateUrl: './ecmr-display-information-field.component.html',
    styleUrl: './ecmr-display-information-field.component.scss'
})
export class EcmrDisplayInformationFieldComponent {

    @Input() label: string;
    @Input() displayedContent: string | string[] | number | null | Date;
    protected readonly Array = Array;
}
