import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponEditComponent } from './coupon-edit.component';

describe('CouponEditComponent', () => {
  let component: CouponEditComponent;
  let fixture: ComponentFixture<CouponEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
