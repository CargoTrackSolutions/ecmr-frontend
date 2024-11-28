/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFromTemplateDialogComponent } from './load-from-template-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoadFromTemplateDialogComponent', () => {
    let component: LoadFromTemplateDialogComponent;
    let fixture: ComponentFixture<LoadFromTemplateDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [LoadFromTemplateDialogComponent, BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {}
        },
        TranslateService,
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

        fixture = TestBed.createComponent(LoadFromTemplateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
