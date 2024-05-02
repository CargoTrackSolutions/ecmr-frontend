import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrDoneIconComponent } from './ecmr-done-icon.component';

describe('EcmrDoneIconComponent', () => {
  let component: EcmrDoneIconComponent;
  let fixture: ComponentFixture<EcmrDoneIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcmrDoneIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcmrDoneIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
