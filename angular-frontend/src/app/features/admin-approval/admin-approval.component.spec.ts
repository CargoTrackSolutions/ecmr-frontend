/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApprovalComponent } from './admin-approval.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.component';

describe('AdminApprovalComponent', () => {
    let component: AdminApprovalComponent;
    let fixture: ComponentFixture<AdminApprovalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminApprovalComponent,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                })],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AdminApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
