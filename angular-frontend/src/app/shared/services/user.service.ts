/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EcmrUser } from '../../core/models/EcmrUser';
import { environment } from '../../../environments/environment';
import { UserCreationAndUpdate } from '../../core/models/UserCreationAndUpdate';
import { Group } from '../../core/models/Group';
import { AuthenticatedUser } from '../../core/models/AuthenticatedUser';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);


    getAllUsers() {
        return this.http.get<EcmrUser[]>(`${environment.backendUrl}/user`)
    }

    getAllUserMail() {
        return this.http.get<string[]>(`${environment.backendUrl}/user/mail`)
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

    getCurrentUserGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(`${environment.backendUrl}/user/current/groups`);
    }

    activateUser(userId: number) {
        return this.http.post<void>(`${environment.backendUrl}/user/${userId}/activate`, {});
    }

    deactivateUser(userId: number) {
        return this.http.post<void>(`${environment.backendUrl}/user/${userId}/deactivate`, {});
    }
}
