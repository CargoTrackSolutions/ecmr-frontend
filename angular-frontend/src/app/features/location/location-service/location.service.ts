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
import { Location } from '../../../core/models/Location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  getAllLocations() {
    return this.http.get<Location[]>(`${environment.backendUrl}/location`)
  }

  createLocation(location: Location) {
    return this.http.post<Location>(`${environment.backendUrl}/location`,location)
  }

  updateLocation(location: Location) {
    return this.http.post<Location>(`${environment.backendUrl}/location/${location.id}`, location);
  }

  deleteLocation() {

  }
}
