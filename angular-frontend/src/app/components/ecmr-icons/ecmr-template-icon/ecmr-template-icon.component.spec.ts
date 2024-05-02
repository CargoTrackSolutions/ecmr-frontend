import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrTemplateIconComponent } from './ecmr-template-icon.component';

describe('EcmrTemplateIconComponent', () => {
  let component: EcmrTemplateIconComponent;
  let fixture: ComponentFixture<EcmrTemplateIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcmrTemplateIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcmrTemplateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
