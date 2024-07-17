/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';

@Component({
    selector: 'app-login-callback',
    standalone: true,
    imports: [],
    templateUrl: './login-callback.component.html',
    styleUrl: './login-callback.component.scss'
})
export class LoginCallbackComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private loadingService: LoadingService) {
    }

    ngOnInit(): void {
        this.loadingService.showLoaderUntilCompleted(this.authService.login())
            .subscribe(result => {
                if (result) {
                    let state = this.activatedRoute.snapshot.queryParamMap.get('state');
                    state = state ? state : '';
                    state = decodeURIComponent(state);
                    const stateParts = state.split(';');
                    let entrypoint = stateParts.find(statePart => statePart.startsWith('entrypoint='));
                    if (!entrypoint) {
                        this.router.navigateByUrl('/');
                    } else {
                        entrypoint = entrypoint.split('=')[1];
                        entrypoint = entrypoint ? entrypoint : '/';
                        this.router.navigateByUrl(entrypoint);
                    }
                } else {
                    this.router.navigateByUrl('/no-permission');
                }
            });
    }
}
