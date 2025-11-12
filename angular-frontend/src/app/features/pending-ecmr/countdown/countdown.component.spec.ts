/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CountdownComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
