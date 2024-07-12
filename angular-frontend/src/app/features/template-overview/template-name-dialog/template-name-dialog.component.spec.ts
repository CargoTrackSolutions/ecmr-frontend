/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateNameDialogComponent } from './template-name-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TemplateNameDialogComponent', () => {
    let component: TemplateNameDialogComponent;
    let fixture: ComponentFixture<TemplateNameDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TemplateNameDialogComponent, BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                })
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                },
                TranslateService
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TemplateNameDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
