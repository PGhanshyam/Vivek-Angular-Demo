import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponViewComponent } from './coupon-view.component';

describe('CouponViewComponent', () => {
  let component: CouponViewComponent;
  let fixture: ComponentFixture<CouponViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
