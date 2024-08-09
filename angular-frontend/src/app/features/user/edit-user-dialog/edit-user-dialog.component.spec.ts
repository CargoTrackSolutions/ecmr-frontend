/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDialogComponent } from './edit-user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditUserDialogComponent', () => {
    let component: EditUserDialogComponent;
    let fixture: ComponentFixture<EditUserDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditUserDialogComponent,
                MatDialogModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {}}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
