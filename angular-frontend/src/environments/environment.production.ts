/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export const environment = {
  production: true,
  // @ts-expect-error: No other possibility?
  backendUrl: window["env"]["BACKEND_API_URL"] || "https://BACKEND_API_URL.environment-variable.not-set",
};
