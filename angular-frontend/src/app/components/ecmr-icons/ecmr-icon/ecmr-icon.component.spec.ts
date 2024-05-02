import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrIconComponent } from './ecmr-icon.component';

describe('EcmrIconComponent', () => {
  let component: EcmrIconComponent;
  let fixture: ComponentFixture<EcmrIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcmrIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcmrIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
