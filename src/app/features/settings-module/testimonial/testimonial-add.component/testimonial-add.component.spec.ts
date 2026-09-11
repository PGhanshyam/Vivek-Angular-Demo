import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialAddComponent } from './testimonial-add.component';

describe('TestimonialAddComponent', () => {
  let component: TestimonialAddComponent;
  let fixture: ComponentFixture<TestimonialAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialAddComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
