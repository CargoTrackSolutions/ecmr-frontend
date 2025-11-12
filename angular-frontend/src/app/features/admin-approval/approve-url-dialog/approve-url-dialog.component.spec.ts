/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUrlDialogComponent } from './approve-url-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';

describe('ApproveUrlDialogComponent', () => {
    let component: ApproveUrlDialogComponent;
    let fixture: ComponentFixture<ApproveUrlDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApproveUrlDialogComponent, MatDialogModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })],
            providers: [
                {provide: MAT_DIALOG_DATA, useValue: {}},
                {provide: MatDialogRef, useValue: {}},
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ApproveUrlDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
