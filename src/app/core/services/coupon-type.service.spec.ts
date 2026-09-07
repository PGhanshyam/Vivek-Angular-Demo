import { TestBed } from '@angular/core/testing';

import { CouponTypeService } from './coupon-type.service';

describe('CouponTypeService', () => {
  let service: CouponTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
