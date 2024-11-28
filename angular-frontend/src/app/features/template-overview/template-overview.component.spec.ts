/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateOverviewComponent } from './template-overview.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TemplateOverviewService } from './template-overview-service/template-overview.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TemplateOverviewComponent', () => {
    let component: TemplateOverviewComponent;
    let fixture: ComponentFixture<TemplateOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [TemplateOverviewComponent, BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateFakeLoader
            }
        })],
    providers: [
        TemplateOverviewService,
        TranslateService,
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

        fixture = TestBed.createComponent(TemplateOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

