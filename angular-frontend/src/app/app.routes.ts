/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Routes } from '@angular/router';
import { EcmrOverviewComponent } from './features/ecmr-overview/ecmrOverview.component';
import { EcmrEditorComponent } from './features/ecmr-editor/ecmr-editor.component';
import { ArchiveComponent } from './features/archive/archive.component';
import { TemplateOverviewComponent } from './features/template-overview/template-overview.component';
import { AuthGuard } from './core/services/auth.service';
import { LoginCallbackComponent } from './features/login-callback/login-callback.component';
import { GroupOverviewComponent } from './features/group/group-overview/group-overview.component';
import { GroupDetailViewComponent } from './features/group/group-detail-view/group-detail-view.component';
import { UserOverviewComponent } from './features/user/user-overview/user-overview.component';
import {PrivacyComponent} from "./features/privacy/privacy.component";
import {LegalMatterComponent} from "./features/legal-matter/legal-matter.component";

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'ecmr-overview'},
    {path: 'login-callback', component: LoginCallbackComponent, canActivate: []},
    {path: 'ecmr-overview', component: EcmrOverviewComponent, canActivate: [AuthGuard]},
    {path: 'ecmr-editor', component: EcmrEditorComponent, canActivate: [AuthGuard]},
    {path: 'ecmr-editor/:id', component: EcmrEditorComponent, canActivate: [AuthGuard]},
    {path: 'ecmr-archive', component: ArchiveComponent, canActivate: [AuthGuard]},
    {path: 'templates-overview', component: TemplateOverviewComponent, canActivate: [AuthGuard]},
    {path: 'template-editor', component: EcmrEditorComponent, canActivate: [AuthGuard]},
    {path: 'template-editor/:id', component: EcmrEditorComponent, canActivate: [AuthGuard]},
    {path: 'ecmr-editor/:id/copy', component: EcmrEditorComponent, canActivate: [AuthGuard]},
    {path: 'group-overview', component: GroupOverviewComponent, canActivate: [AuthGuard]},
    {path: 'group-detail/:id', component: GroupDetailViewComponent, canActivate: [AuthGuard]},
    {path: 'user-overview', component: UserOverviewComponent, canActivate: [AuthGuard]},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'imprint-legal-matter', component: LegalMatterComponent},
];
