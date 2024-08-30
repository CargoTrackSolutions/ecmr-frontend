/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TemplateUser } from '../../../core/models/TemplateUser';

@Injectable({
  providedIn: 'root'
})
export class TemplateOverviewService {

  constructor(private http: HttpClient) {
  }

  getAllTemplates() {
    return this.http.get<TemplateUser[]>(`${environment.backendUrl}/template`)
  }

  deleteTemplate(id: number) {
    return this.http.delete(`${environment.backendUrl}/template/${id}`)
  }

  shareTemplate(id: number, userIds: number[]) {
    return this.http.post<TemplateUser>(`${environment.backendUrl}/template/share/${id}`, userIds)
  }
}
