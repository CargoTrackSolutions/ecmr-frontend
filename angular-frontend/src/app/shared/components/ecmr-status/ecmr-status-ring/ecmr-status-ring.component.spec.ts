/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrStatusRingComponent } from './ecmr-status-ring.component';

describe('EcmrStatusRingComponent', () => {
    let component: EcmrStatusRingComponent;
    let fixture: ComponentFixture<EcmrStatusRingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EcmrStatusRingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EcmrStatusRingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
