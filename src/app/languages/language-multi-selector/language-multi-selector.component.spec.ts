import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageMultiSelectorComponent } from './language-multi-selector.component';

describe('LanguageMultiSelectorComponent', () => {
  let component: LanguageMultiSelectorComponent;
  let fixture: ComponentFixture<LanguageMultiSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageMultiSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageMultiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
