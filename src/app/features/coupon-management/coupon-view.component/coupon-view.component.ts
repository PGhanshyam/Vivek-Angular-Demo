import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Coupon } from '../../../core/models/coupon.model';
import { CouponService } from '../../../core/services/coupon.service';
import { CouponTypeService } from '../../../core/services/coupon-type.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-coupon-view.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupon-view.component.html',
  styleUrl: './coupon-view.component.scss'
})
export class CouponViewComponent implements OnInit {

  couponId = 0;
  coupon: Coupon | null = null;
  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly couponService: CouponService,
    private readonly couponTypeService: CouponTypeService,
    private readonly alertService: AlertService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const routeId = this.route.snapshot.paramMap.get('id');

    this.couponId = Number(routeId);

    if (!this.couponId || Number.isNaN(this.couponId)) {
      this.alertService.error('Invalid coupon ID.');
      this.closeView();
      return;
    }

    this.loadCoupon();
  }

  private loadCoupon(): void {

    this.isLoading = true;

    this.alertService.loading('Loading coupon details...');

    this.couponService.getCouponById(this.couponId).subscribe({

      next: (response: any) => {

        this.isLoading = false;
        this.alertService.close();

        let item = response;
        if (item && typeof item === 'object') {
          if (Array.isArray(item)) {
            item = item[0];
          } else if (item.data) {
            item = Array.isArray(item.data) ? item.data[0] : item.data;
          } else if (item.coupon) {
            item = Array.isArray(item.coupon) ? item.coupon[0] : item.coupon;
          } else if (item.result) {
            item = Array.isArray(item.result) ? item.result[0] : item.result;
          }
        }

        if (item && typeof item === 'object') {
          const typeId = Number(item.couponTypeId ?? item.CouponTypeId ?? item.coupon_type_id ?? 0);
          let typeName = item.couponTypeName ?? item.CouponTypeName ?? item.coupon_type_name ?? '';
          if (!typeName) {
            if (typeId === 1) typeName = 'Special';
            else if (typeId === 2) typeName = 'General';
          }

          const rawActive = item.isActive ?? item.IsActive ?? item.is_active ?? item.status;

          this.coupon = {
            couponId: Number(item.couponId ?? item.CouponId ?? item.coupon_id ?? item.id ?? item.Id ?? this.couponId),
            couponTypeId: typeId,
            couponTypeName: typeName,
            couponCode: String(item.couponCode ?? item.CouponCode ?? item.coupon_code ?? ''),
            description: String(item.description ?? item.Description ?? ''),
            startDate: this.formatDate(item.startDate ?? item.StartDate ?? item.start_date),
            expiryDate: this.formatDate(item.expiryDate ?? item.ExpiryDate ?? item.expiry_date),
            discountType: String(item.discountType ?? item.DiscountType ?? item.discount_type ?? (typeId === 1 ? 'Percentage' : 'Fixed Amount')),
            discountValue: Number(item.discountValue ?? item.DiscountValue ?? item.discount_value ?? 0),
            isActive: rawActive === undefined || rawActive === null ? true : (rawActive === true || rawActive === 1 || String(rawActive).toLowerCase() === 'true'),
            createdDate: String(item.createdDate ?? item.CreatedDate ?? item.created_date ?? '')
          };

          // If couponTypeName is still empty, load from CouponTypeService
          if (!this.coupon.couponTypeName && this.coupon.couponTypeId) {
            this.couponTypeService.getCouponTypes().subscribe({
              next: (types) => {
                const found = types.find(t => t.couponTypeId === Number(this.coupon?.couponTypeId));
                if (found && this.coupon) {
                  this.coupon.couponTypeName = found.couponTypeName;
                  this.cdr.markForCheck();
                  try {
                    this.cdr.detectChanges();
                  } catch (e) { }
                }
              }
            });
          }

        } else {
          this.coupon = null;
          this.alertService.error('Coupon not found.');
          this.closeView();
        }

        this.cdr.markForCheck();
        try {
          this.cdr.detectChanges();
        } catch (e) { }

      },

      error: (error) => {
        console.error('Error loading coupon:', error);
        this.isLoading = false;
        this.alertService.close();
        this.coupon = null;
        this.alertService.error(error?.error?.message ?? 'Unable to load coupon details.');
        this.closeView();
        this.cdr.markForCheck();
      }

    });
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') {
      const dateOnly = dateVal.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        return dateOnly;
      }
    }
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return String(dateVal);
    }
  }

  closeView(): void {
    this.router.navigate(['/coupon-code']);
  }

}