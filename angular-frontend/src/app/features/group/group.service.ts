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
import { GroupFlat } from '../../core/models/GroupFlat';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(private http: HttpClient) {
    }

    getAllGroups(currentUserGroupsOnly: boolean) {
        const params = {'currentUserGroupsOnly': currentUserGroupsOnly}
        return this.http.get<Group[]>(`${environment.backendUrl}/group`, {params: params});
    }

    getGroupWithId(id: number) {
        return this.http.get<Group>(`${environment.backendUrl}/group/${id}`)
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

    getAllGroupsAsFlatList(currentUserGroupsOnly: boolean) {
        const params = {'currentUserGroupsOnly': currentUserGroupsOnly}
        return this.http.get<GroupFlat[]>(`${environment.backendUrl}/group/flat-list`, {params: params});
    }
}
