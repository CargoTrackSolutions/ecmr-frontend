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
import { PrivacyComponent } from './features/privacy/privacy.component';
import { LegalMatterComponent } from './features/legal-matter/legal-matter.component';
import { UserRole } from './core/enums/UserRole';
import { HistoryComponent } from './features/history/history.component';
import { ExternalUserRegistrationComponent } from './features/external-user-registration/external-user-registration.component';
import {
    ExternalUserRegistrationSuccessComponent
} from './features/external-user-registration/external-user-registration-success/external-user-registration-success.component';
import { AdminApprovalComponent } from './features/admin-approval/admin-approval.component';
import { PendingEcmrComponent } from './features/pending-ecmr/pending-ecmr.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'ecmr-overview'},
    {path: 'login-callback', component: LoginCallbackComponent, canActivate: []},
    {path: 'ecmr-overview', component: EcmrOverviewComponent, canActivate: [AuthGuard], data: {role: UserRole.NoEcmrCreationUser}},
    {path: 'ecmr-editor', component: EcmrEditorComponent, canActivate: [AuthGuard], data: {role: UserRole.User}},
    {path: 'ecmr-editor/:id', component: EcmrEditorComponent, canActivate: [AuthGuard], data: {role: UserRole.NoEcmrCreationUser}},
    {path: 'ecmr-tan/:id/:userToken/:tan', component: EcmrEditorComponent},
    {path: 'ecmr-archive', component: ArchiveComponent, canActivate: [AuthGuard], data: {role: UserRole.NoEcmrCreationUser}},
    {path: 'templates-overview', component: TemplateOverviewComponent, canActivate: [AuthGuard], data: {role: UserRole.User}},
    {path: 'template-editor', component: EcmrEditorComponent, canActivate: [AuthGuard], data: {role: UserRole.User}},
    {path: 'template-editor/:id', component: EcmrEditorComponent, canActivate: [AuthGuard], data: {role: UserRole.User}},
    {path: 'ecmr-editor/:id/copy', component: EcmrEditorComponent, canActivate: [AuthGuard], data: {role: UserRole.User}},
    {path: 'group-overview', component: GroupOverviewComponent, canActivate: [AuthGuard], data: {role: UserRole.Admin}},
    {path: 'group-detail/:id', component: GroupDetailViewComponent, canActivate: [AuthGuard], data: {role: UserRole.Admin}},
    {path: 'user-overview', component: UserOverviewComponent, canActivate: [AuthGuard], data: {role: UserRole.Admin}},
    {path: 'admin-approval', component: AdminApprovalComponent, canActivate: [AuthGuard], data: {role: UserRole.Admin}},
    {path: 'pending-ecmr', component: PendingEcmrComponent, canActivate: [AuthGuard], data: {role: UserRole.Admin}},
    {path: 'external-user-registration/:id', component: ExternalUserRegistrationComponent},
    {path: 'external-user-registration-success/:id', component: ExternalUserRegistrationSuccessComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'imprint-legal-matter', component: LegalMatterComponent},
    {path: 'history/:id/:refId', component: HistoryComponent, canActivate: [AuthGuard]}
];
