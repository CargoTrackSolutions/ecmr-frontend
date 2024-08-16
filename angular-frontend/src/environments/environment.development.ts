/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'YOUR-ISSUER',
  clientId: 'YOUR-CLIENT-ID',
  requireHttps: false,
  useSilentRefresh: false,
  responseType: 'code',
  disableAtHashCheck: true,
  redirectUri: window.location.origin + '/login-callback',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true
};

export const environment = {
  production: false,
  backendUrl: "http://localhost:8080/api",
  authConfig
};

