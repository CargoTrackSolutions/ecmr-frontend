/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  // @ts-expect-error: .
  issuer: window["env"]["OAUTH_ISSUER"] || "OAUTH_ISSUER-environment-variable-not-set",
  // @ts-expect-error: .
  clientId: window["env"]["OAUTH_CLIENT_ID"] || "OAUTH_CLIENT_ID-environment-variable-not-set",
  requireHttps: false,
  useSilentRefresh: false,
  responseType: 'code',
  disableAtHashCheck: true,
  redirectUri: window.location.origin + '/login-callback',
  // @ts-expect-error: .
  scope: 'openid profile email ' + (window["env"]["OAUTH_ADDITIONAL_SCOPES"] || ''),
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true
};

export const environment = {
  production: true,
  // @ts-expect-error: .
  backendUrl: window["env"]["BACKEND_API_URL"] || "https://BACKEND_API_URL.environment-variable.not-set",
  authConfig
};
