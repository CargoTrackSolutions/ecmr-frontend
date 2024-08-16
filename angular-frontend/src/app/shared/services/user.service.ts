/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcmrUser } from '../../core/models/EcmrUser';
import { environment } from '../../../environments/environment';
import { UserCreationAndUpdate } from '../../core/models/UserCreationAndUpdate';
import { Group } from '../../core/models/Group';
import { AuthenticatedUser } from '../../core/models/AuthenticatedUser';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    getAllUsers() {
        return this.http.get<EcmrUser[]>(`${environment.backendUrl}/user`)
    }

    createUser(user: UserCreationAndUpdate) {
        return this.http.post<EcmrUser>(`${environment.backendUrl}/user`, user)
    }

    updateUser(user: UserCreationAndUpdate, userID: number) {
        return this.http.post<EcmrUser>(`${environment.backendUrl}/user/${userID}`, user)
    }

    getGroupsForUser(userId: number) {
        return this.http.get<Group[]>(`${environment.backendUrl}/user/${userId}/groups`)
    }

    getCurrentUser() {
        return this.http.get<AuthenticatedUser>(`${environment.backendUrl}/user/current`);
    }
}
