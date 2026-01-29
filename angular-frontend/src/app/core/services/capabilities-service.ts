/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable, signal } from '@angular/core';
import { BackendCapabilities } from '../models/capabilities/backend-capabilities';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CapabilitiesService {
    private http: HttpClient = inject(HttpClient);
    private readonly backendUrl: string = environment.backendUrl + '/capabilities';

    private readonly _capabilities = signal<BackendCapabilities>({
        externalUserManagement: {
            changeMfa: false,
            resetPassword: false,
            getExternalUserMfaStatus: false
        }
    });

    readonly capabilities = this._capabilities.asReadonly();

    private loaded = false;

    load(): void {
        if (this.loaded) return;

        this.http.get<BackendCapabilities>(this.backendUrl).subscribe(caps => this._capabilities.set(caps));
        this.loaded = true;
    }
}
