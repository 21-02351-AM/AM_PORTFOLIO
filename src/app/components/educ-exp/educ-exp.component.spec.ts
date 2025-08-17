import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducExpComponent } from './educ-exp.component';

describe('EducExpComponent', () => {
  let component: EducExpComponent;
  let fixture: ComponentFixture<EducExpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EducExpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
