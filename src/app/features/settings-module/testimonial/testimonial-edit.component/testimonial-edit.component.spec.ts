import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialEditComponent } from './testimonial-edit.component';

describe('TestimonialEditComponent', () => {
  let component: TestimonialEditComponent;
  let fixture: ComponentFixture<TestimonialEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
