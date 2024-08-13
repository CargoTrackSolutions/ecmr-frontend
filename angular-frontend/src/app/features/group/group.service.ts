/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '../../core/models/Group';
import { environment } from '../../../environments/environment';
import { GroupCreation } from '../../core/models/GroupCreation';
import { EcmrUser } from '../../core/models/EcmrUser';
import { GroupUpdate } from '../../core/models/GroupUpdate';
import { GroupParentUpdate } from '../../core/models/GroupParentUpdate';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(private http: HttpClient) {
    }

    getAllGroups() {
        return this.http.get<Group[]>(`${environment.backendUrl}/group`)
    }

    getGroupWithId(id: number) {
        return this.http.get<Group>(`${environment.backendUrl}/group/${id}`)
    }

    getGroupsWithLocationId(id: number) {
        return this.http.get<Group[]>(`${environment.backendUrl}/location/${id}/groups`)
    }

    createGroup(group: GroupCreation) {
        return this.http.post<Group>(`${environment.backendUrl}/group`, group)
    }

    getUsersForGroup(groupId: number) {
        return this.http.get<EcmrUser[]>(`${environment.backendUrl}/group/${groupId}/users`);
    }

    updateGroup(group: GroupUpdate, groupId: number) {
        return this.http.post<Group>(`${environment.backendUrl}/group/${groupId}`, group)
    }

    updateGroupParent(groupParentUpdate: GroupParentUpdate, groupId: number) {
        return this.http.post<Group>(`${environment.backendUrl}/group/${groupId}/update-parent`, groupParentUpdate)
    }
}
