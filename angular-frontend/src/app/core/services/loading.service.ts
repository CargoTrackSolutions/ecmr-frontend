/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, delay, finalize, map, Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private state = new BehaviorSubject<LoadingState>(LoadingState.Initial);
    public isLoading$: Observable<boolean> = this.state.asObservable().pipe(
        map(state => state == LoadingState.Loading),
    )

    constructor() {
    }

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null)
            .pipe(
                delay(0),
                tap(() => {
                    this.state.next(LoadingState.Loading);
                }),
                concatMap(() => obs$),
                finalize(() => {
                    this.state.next(LoadingState.NotLoading)
                })
            );
    }
}

export enum LoadingState {
    Initial,
    Loading,
    NotLoading
}
