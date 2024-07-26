/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-ecmr-display-information-field',
    standalone: true,
    imports: [
        TranslateModule
    ],
    templateUrl: './ecmr-display-information-field.component.html',
    styleUrl: './ecmr-display-information-field.component.scss'
})
export class EcmrDisplayInformationFieldComponent {

    @Input() label: string;
    @Input() displayedContent: string | number | null | Date;
}
