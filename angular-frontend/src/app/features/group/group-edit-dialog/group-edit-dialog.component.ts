/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { Location } from '../../../core/models/Location';
import { LocationService } from '../../location/location-service/location.service';
import { Group } from '../../../core/models/Group';
import { GroupCreationAndUpdate } from '../../../core/models/GroupCreationAndUpdate';
import { GroupService } from '../group.service';
import { catchError, filter, of } from 'rxjs';

@Component({
    selector: 'app-group-edit-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatDialogActions,
        MatFormField,
        TranslateModule,
        MatInput,
        ReactiveFormsModule,
        MatSelect,
        MatLabel,
        MatIcon,
        MatOption,
        MatError
    ],
    templateUrl: './group-edit-dialog.component.html',
    styleUrl: './group-edit-dialog.component.scss'
})
export class GroupEditDialogComponent {

    groupFormGroup = new FormGroup({
        name: new FormControl<string>('', [Validators.required]),
        location: new FormControl<Location | null>(null, [Validators.required]),
    });

    locations: Location[] = [];

    currentGroup: Group;
    isEditMode: boolean = false;

    constructor(public dialogRef: MatDialogRef<GroupEditDialogComponent>,
                private groupService: GroupService,
                @Inject(MAT_DIALOG_DATA) public data: Group,
                private locationService: LocationService) {
        if (data) {
            this.currentGroup = data;
            this.groupFormGroup.patchValue(data);
            this.isEditMode = true;
        }
        this.locationService.getAllLocations().subscribe(locs => {
            this.locations = locs
        })
    }

    compareLocationFn(c1: Location, c2: Location): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    saveGroup() {
        if (this.groupFormGroup.valid) {
            const group: GroupCreationAndUpdate = {
                name: this.groupFormGroup.controls.name.value!,
                locationId: this.groupFormGroup.controls.location.value!.id!
            }
            if (this.isEditMode) {
                this.groupService.updateGroup(group, this.currentGroup.id).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err);
                        return of(null)
                    })
                ).subscribe(res => {
                    if (res) this.dialogRef.close(res)
                })
            } else {
                this.groupService.createGroup(group).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err);
                        return of(null)
                    })
                ).subscribe(res => {
                    if (res) this.dialogRef.close(res)
                })
            }
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
