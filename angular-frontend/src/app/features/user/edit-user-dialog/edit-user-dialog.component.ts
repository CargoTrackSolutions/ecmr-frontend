/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDrawerContent } from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDisableControlDirective } from '../../ecmr-editor/dynamic-disable-control.directive';
import { CountryCode } from '../../../core/enums/CountryCode';
import { LocationService } from '../../location/location-service/location.service';
import { Location } from '../../../core/models/Location';
import { GroupService } from '../../group/group.service';
import { catchError, combineLatest, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Group } from '../../../core/models/Group';
import { LocationFormGroup } from '../../group/LocationFormGroup';
import { GroupFormGroup } from '../../group/GroupFormGroup';
import { UserRole } from '../../../core/enums/UserRole';
import { EcmrUser } from '../../../core/models/EcmrUser';
import { UserService } from '../../../shared/services/user.service';
import { UserCreationAndUpdate } from '../../../core/models/UserCreationAndUpdate';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-edit-user-dialog',
    standalone: true,
    imports: [
        MatDrawerContent,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton,
        MatCard,
        MatCardContent,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        NgForOf,
        NgIf,
        MatLabel,
        MatIcon,
        MatSelect,
        MatOption,
        MatAutocomplete,
        MatAutocompleteTrigger,
        TranslateModule,
        DynamicDisableControlDirective,
        AsyncPipe,
        NgClass,
        MatIconButton,
        KeyValuePipe,
        MatError
    ],
    templateUrl: './edit-user-dialog.component.html',
    styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit, AfterViewInit {

    filteredCountries: Observable<string[]>;
    countries = Object.keys(CountryCode);

    userFormGroup = new FormGroup({
        country: new FormControl<CountryCode | null>(null, Validators.required),
        firstName: new FormControl<string>('', Validators.required),
        lastName: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', Validators.required),
        phone: new FormControl<string>(''),
        role: new FormControl<UserRole | null>(null, Validators.required),
    })

    locationsAndGroups = new FormGroup({
        locations: new FormArray<FormGroup<LocationFormGroup>>([]),
    });

    locationsFormGroup = new FormArray([
        new FormGroup<LocationFormGroup>({
            location: new FormControl<Location | null>(null),
            groupsList: new FormControl<Group[]>([]),
            groups: new FormArray<FormGroup<GroupFormGroup>>([]),
        })
    ]);

    groupFormGroup = new FormArray([
        new FormGroup<GroupFormGroup>({
            group: new FormControl<Group | null>(null),
        })
    ]);

    originalLocations: Location[] = [];
    unusedLocations: Location[] = [];

    user: EcmrUser;

    isEditMode: boolean = false;

    constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
                private groupService: GroupService,
                private userService: UserService,
                private loadingService: LoadingService,
                @Inject(MAT_DIALOG_DATA) public data: EcmrUser,
                private locationService: LocationService) {
        if (data?.id) {
            this.user = data;
            this.isEditMode = true;
            this.initializeForm(data);
        }
    }

    initializeForm(user: EcmrUser) {
        this.userFormGroup.patchValue(user);
    }

    ngOnInit() {
        this.filteredCountries = this.userFormGroup.controls.country.valueChanges
            .pipe(
                startWith(this.userFormGroup.controls.country.value ?? ''),
                map(value => this._filter(value ?? ''))
            );

        this.loadingService.showLoaderUntilCompleted(this.locationService.getAllLocations()).subscribe(locs => {
            this.originalLocations = locs;
            this.unusedLocations = locs;
        })
        this.addLocation();
    }

    ngAfterViewInit() {
        if (this.user?.id) {
            this.userService.getLocationsForUser(this.user.id).pipe(
                switchMap(location => {
                    return combineLatest([of(location), this.userService.getGroupsForUser(this.user.id!)]);
                })
            ).subscribe(([locationResponse, groupResponse]) => {
                for (let i = 0; i < locationResponse.length; i++) {
                    this.addLocation();
                    this.locationsAndGroups.controls.locations.controls[i].controls.location.setValue(locationResponse[i])
                }
                for (const element of groupResponse) {
                    const locationFormGroup = this.locationsAndGroups.controls.locations.controls.find(loc =>
                        loc.controls.location.getRawValue()?.id === element.location.id)
                    if (locationFormGroup) {
                        this.addGroup(locationFormGroup);
                        const groupForm = locationFormGroup.controls.groups.controls.at(locationFormGroup.controls.groups.controls.length - 1)
                        if (groupForm) groupForm.controls.group.setValue(element);
                    }
                }
            })
        }
    }

    /**
     * Filter function for country autocomplete fields
     */
    private _filter(value: string): string[] {
        if (value) {
            const filteredValue: string = value.toUpperCase();
            return this.countries.filter(option =>
                option.includes(filteredValue)
            );
        } else {
            return []
        }
    }

    createLocationFormGroup(): FormGroup<LocationFormGroup> {
        return new FormGroup<LocationFormGroup>({
            location: new FormControl<Location | null>(null),
            groupsList: new FormControl<Group[] | null>([]),
            groups: new FormArray<FormGroup<GroupFormGroup>>([])
        });
    }

    createGroupFormGroup(): FormGroup<GroupFormGroup> {
        return new FormGroup<GroupFormGroup>({
            group: new FormControl<Group | null>(null)
        });
    }

    addLocation() {
        const locationFormGroup = this.createLocationFormGroup();
        this.locationsAndGroups.controls.locations.push(locationFormGroup);
        this.addLocationChangeListener(locationFormGroup);
    }

    locationChange(event: MatSelectChange) {
        const locationForm = this.locationsAndGroups.controls.locations.controls.find(location => location.controls.location.getRawValue()?.id === event.value.id)
        if (locationForm) locationForm.controls.groups.clear();
    }

    addLocationChangeListener(locationFormGroup: FormGroup<LocationFormGroup>) {
        locationFormGroup.controls.location.valueChanges.pipe(
            switchMap(value => {
                if (value?.id) {
                    return combineLatest([of(value), this.groupService.getGroupsWithLocationId(value.id)]);
                } else {
                    return of([null, null]);
                }
            })
        ).subscribe(([value, groups]) => {
            const locationsLength = this.locationsAndGroups.controls.locations.controls.length;
            if (value && this.locationsAndGroups.controls.locations.controls.length < this.originalLocations.length &&
                this.locationsAndGroups.controls.locations.controls[locationsLength - 1].getRawValue().location != null) {
                locationFormGroup.controls.groupsList.setValue(groups);
                this.addLocation();
                this.addGroup(locationFormGroup);
            } else if (value) {
                locationFormGroup.controls.groupsList.setValue(groups);
                this.addGroup(locationFormGroup);
            }
        });
    }

    addGroupChangeListener(groupFormGroup: FormGroup<GroupFormGroup>, locationFormGroup: FormGroup<LocationFormGroup>) {
        groupFormGroup.controls.group.valueChanges.subscribe(nextGroup => {
            const groupsLength = locationFormGroup.controls.groups.controls.length;
            const groupsListValue = locationFormGroup.controls.groupsList.value;
            if (nextGroup && groupsListValue && groupsLength < groupsListValue.length && groupsLength > 0 && locationFormGroup.controls.groups.controls[groupsLength - 1].getRawValue().group != null) {
                this.addGroup(locationFormGroup);
            }
        });
    }

    addGroup(locationFormGroup: FormGroup<LocationFormGroup>) {
        const groupFormGroup = this.createGroupFormGroup();
        locationFormGroup.controls.groups.push(groupFormGroup);
        this.addGroupChangeListener(groupFormGroup, locationFormGroup);
    }

    isLocationUsed(location: Location): boolean {
        return this.locationsAndGroups.controls.locations.controls.some(loc => {
            const locationFormValue: Location | null = loc.controls.location.value;
            return locationFormValue ? locationFormValue.id === location.id : false;
        });
    }

    isGroupUsed(group: Group, groups: FormArray<FormGroup<GroupFormGroup>>) {
        return groups.controls.some(gro => {
            const groupFormValue: Group | null = gro.controls.group.value;
            return groupFormValue ? groupFormValue.id === group.id : false;
        });
    }

    removeLocation(locationControl: FormGroup<LocationFormGroup>) {
        const locationIndex = this.locationsAndGroups.controls.locations.controls.findIndex(loc => loc.controls.location.value?.id === locationControl.controls.location.value?.id);
        this.locationsAndGroups.controls.locations.removeAt(locationIndex);
        const length = this.locationsAndGroups.controls.locations.controls.length - 1
        if (this.locationsAndGroups.controls.locations.controls[length].value.location != null) {
            this.addLocation();
        }
    }

    removeGroup(locationControl: FormGroup<LocationFormGroup>, group: Group) {
        const groupIndex = locationControl.controls.groups.controls.findIndex(gro => gro.controls.group.value?.id === group.id);
        locationControl.controls.groups.removeAt(groupIndex);
        const length = locationControl.controls.groups.controls.length - 1
        if (locationControl.controls.groups.controls.length == 0 || locationControl.controls.groups.controls[length].value.group != null) {
            this.addGroup(locationControl);
        }
    }

    saveUser() {
        this.userFormGroup.markAllAsTouched();
        if (this.userFormGroup.valid) {
            const locationIds: number[] = [];
            const groupIds: number[] = [];
            this.locationsAndGroups.controls.locations.controls.forEach(location => {
                const locationId: number | null | undefined = location.controls.location.getRawValue()?.id;
                if (location.controls.location && locationId) {
                    locationIds.push(locationId)
                }
                location.controls.groups.controls.forEach(group => {
                    const groupId: number | null | undefined = group.controls.group.getRawValue()?.id;
                    if (group.controls.group && groupId) {
                        groupIds.push(groupId)
                    }
                })
            })
            const user: UserCreationAndUpdate = {
                firstName: this.userFormGroup.controls.firstName.value!,
                lastName: this.userFormGroup.controls.lastName.value!,
                email: this.userFormGroup.controls.email.value!,
                phone: this.userFormGroup.controls.phone.value,
                role: this.userFormGroup.controls.role.value!,
                country: this.userFormGroup.controls.country.value!,
                groupIds: groupIds,
                locationIds: locationIds
            }
            if (this.isEditMode && this.user?.id) {
                this.userService.updateUser(user, this.user.id).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err)
                        return of(null)
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result)
                    }
                });
            } else {
                this.userService.createUser(user).pipe(
                    filter(result => !!result),
                    catchError(err => {
                        console.warn(err)
                        return of(null)
                    })
                ).subscribe(result => {
                    if (result) {
                        this.dialogRef.close(result)
                    }
                });
            }
        }
    }

    compareLocationFn(c1: Location, c2: Location): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    compareGroupFn(c1: Group, c2: Group): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    closeDialog() {
        this.dialogRef.close();
    }

    protected readonly UserRole = UserRole;
}
