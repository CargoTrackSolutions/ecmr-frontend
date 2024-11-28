/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailViewComponent } from './group-detail-view.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GroupService } from '../group.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GroupDetailViewComponent', () => {
    let component: GroupDetailViewComponent;
    let fixture: ComponentFixture<GroupDetailViewComponent>;
    let mockGroupService;

    beforeEach(async () => {
        mockGroupService = jasmine.createSpyObj('GroupService', ['getUsersForGroup', 'getGroupWithId']);
        await TestBed.configureTestingModule({
    imports: [GroupDetailViewComponent,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                params: of({ id: 'someId' }) // Mock params observable with 'id'
            }
        },
        { provide: GroupService, useValue: mockGroupService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();

        fixture = TestBed.createComponent(GroupDetailViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
