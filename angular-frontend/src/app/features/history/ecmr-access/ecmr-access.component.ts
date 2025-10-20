/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { EcmrService } from '../../../shared/services/ecmr.service';
import { LoadingService } from '../../../core/services/loading.service';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EcmrAssignment } from '../../../core/models/EcmrAssignment';
import { EcmrRole } from '../../../core/enums/EcmrRole';
import { CdkConnectedOverlay, CdkOverlayOrigin, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { MatCard } from '@angular/material/card';
import { ExternalUser } from '../../../core/models/ExternalUser';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ecmr-access',
    imports: [
        MatIcon,
        MatTable,
        MatSort,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        MatCellDef,
        MatHeaderCellDef,
        CdkConnectedOverlay,
        MatCard,
        CdkOverlayOrigin,
        TranslatePipe
    ],
    templateUrl: './ecmr-access.component.html',
    styleUrl: './ecmr-access.component.scss'
})
export class EcmrAccessComponent implements OnInit, AfterViewInit {
    private readonly ecmrService = inject(EcmrService);
    private readonly loadingService = inject(LoadingService);
    private _location = inject(Location);


    displayedColumns: string[] = ['role', 'group_user'];
    dataSource: MatTableDataSource<EcmrAssignment> = new MatTableDataSource();

    @ViewChild(MatSort) sort: MatSort;

    assignments: EcmrAssignment[] = [];

    readonly ecmrId = input<string>();
    readonly referenceId = input<string>('');

    isOverlayOpen = false;
    overlayOrigin: CdkOverlayOrigin | FlexibleConnectedPositionStrategyOrigin | null;
    overlayUser: ExternalUser | null;

    ngOnInit(): void {
        const ecmrId = this.ecmrId();
        if (ecmrId) {
            this.loadingService.showLoaderUntilCompleted(this.ecmrService.getEcmrAssignments(ecmrId)).subscribe(assignments => {
                this.assignments = assignments;
                this.dataSource.data = this.assignments;
            });
        }

    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    openOverlay(user: ExternalUser | null, origin: CdkOverlayOrigin | FlexibleConnectedPositionStrategyOrigin) {
        if (user) {
            this.overlayUser = user;
            this.overlayOrigin = origin;
            this.isOverlayOpen = true;
        }
    }

    closeOverlay() {
        this.isOverlayOpen = false;
        this.overlayUser = null;
        this.overlayOrigin = null;
    }

    protected readonly EcmrRole = EcmrRole;
}
