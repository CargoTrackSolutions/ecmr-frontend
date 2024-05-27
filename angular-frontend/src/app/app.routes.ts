/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {Routes} from '@angular/router';
import {EcmrOverviewComponent} from "./features/ecmr-overview/ecmrOverview.component";

export const routes: Routes = [
    { path: 'ecmr-overview', component: EcmrOverviewComponent },
    // { path: 'ecmr-archive', component: ecmrArchive },
    // { path: 'ecmr-templates-overview', component: ecmrTemplatesOverview },
    // { path: 'privacy', component: privacy },
    // { path: 'imprint-legal-matter', component: imprintLegalMatter },
];
