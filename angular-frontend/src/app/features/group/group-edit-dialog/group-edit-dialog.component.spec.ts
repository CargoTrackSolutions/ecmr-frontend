/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEditDialogComponent } from './group-edit-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupEditDialogComponent', () => {
    let component: GroupEditDialogComponent;
    let fixture: ComponentFixture<GroupEditDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                GroupEditDialogComponent,
                MatDialogModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })
            ],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {}}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GroupEditDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
