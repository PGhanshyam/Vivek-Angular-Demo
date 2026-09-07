import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Coupon } from '../../../core/models/coupon.model';
import { CouponType } from '../../../core/models/coupon-type.model';

import { CouponService } from '../../../core/services/coupon.service';
import { CouponTypeService } from '../../../core/services/coupon-type.service';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-coupon-edit.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coupon-edit.component.html',
  styleUrl: './coupon-edit.component.scss'
})
export class CouponEditComponent implements OnInit {

  couponForm!: FormGroup;
  couponId = 0;
  coupon: Coupon | null = null;

  couponTypes: CouponType[] = [
    {
      couponTypeId: 1,
      couponTypeName: 'Special',
      isActive: true
    },
    {
      couponTypeId: 2,
      couponTypeName: 'General',
      isActive: true
    }
  ];

  discountTypes: string[] = [
    'Percentage',
    'Fixed Amount'
  ];

  isLoading = false;

  isSaving = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly couponService: CouponService,
    private readonly couponTypeService: CouponTypeService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {

    this.couponForm = this.fb.group({

      couponTypeId: [
        '',
        Validators.required
      ],

      couponCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      description: [
        '',
        Validators.maxLength(255)
      ],

      startDate: [
        '',
        Validators.required
      ],

      expiryDate: [
        '',
        Validators.required
      ],

      discountType: [
        '',
        Validators.required
      ],

      discountValue: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      isActive: [
        true
      ]
    });

  }

  ngOnInit(): void {

    const routeId = this.route.snapshot.paramMap.get('id');

    this.couponId = Number(routeId);

    if (!this.couponId || Number.isNaN(this.couponId)) {
      this.alertService.error('Invalid coupon ID.');
      this.cancel();
      return;
    }

    this.loadCouponTypes();
    this.loadCoupon();

  }

  loadCouponTypes(): void {

    this.couponTypeService.getCouponTypes().subscribe({

      next: (response: CouponType[]) => {
        if (response && response.length > 0) {
          this.couponTypes = response;
        }
      },

      error: (error) => {
        console.error('Error loading coupon types:', error);
      }

    });
  }

  loadCoupon(): void {

    this.isLoading = true;

    this.alertService.loading('Loading coupon...');

    this.couponService.getCouponById(this.couponId).subscribe({

      next: (response: any) => {

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
            startDate: item.startDate ?? item.StartDate ?? item.start_date,
            expiryDate: item.expiryDate ?? item.ExpiryDate ?? item.expiry_date,
            discountType: String(item.discountType ?? item.DiscountType ?? item.discount_type ?? (typeId === 1 ? 'Percentage' : 'Fixed Amount')),
            discountValue: Number(item.discountValue ?? item.DiscountValue ?? item.discount_value ?? 0),
            isActive: rawActive === undefined || rawActive === null ? true : (rawActive === true || rawActive === 1 || String(rawActive).toLowerCase() === 'true'),
            createdDate: String(item.createdDate ?? item.CreatedDate ?? item.created_date ?? '')
          };

          this.patchForm();
          this.isLoading = false;

          this.cdr.markForCheck();
          try {
            this.cdr.detectChanges();
          } catch (e) { }

        } else {
          this.isLoading = false;
          this.alertService.error('Coupon not found.');
          this.cancel();
        }
      },

      error: (error) => {
        console.error('Error loading coupon:', error);
        this.isLoading = false;
        this.alertService.close();
        this.alertService.error('Unable to load coupon.');
        this.cancel();
        this.cdr.markForCheck();
      }

    });

  }

  private patchForm(): void {

    if (!this.coupon) {
      return;
    }

    this.couponForm.patchValue({
      couponTypeId: this.coupon.couponTypeId,
      couponCode: this.coupon.couponCode,
      description: this.coupon.description ?? '',
      startDate: this.formatDateForInput(this.coupon.startDate),
      expiryDate: this.formatDateForInput(this.coupon.expiryDate),
      discountType: this.coupon.discountType || 'Percentage',
      discountValue: this.coupon.discountValue,
      isActive: this.coupon.isActive
    });

  }

  private formatDateForInput(date: any): string {
    if (!date) {
      return '';
    }
    if (typeof date === 'string') {
      const dateOnly = date.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        return dateOnly;
      }
    }
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return String(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return String(date);
    }
  }

  get f() {
    return this.couponForm.controls;
  }

  autoGenerateCoupon(): void {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let couponCode = '';

    for (let i = 0; i < 10; i++) {
      couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    this.couponForm.patchValue({
      couponCode: couponCode
    });

  }

  updateCoupon(): void {

    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }

    if (!this.coupon) {
      this.alertService.error('Coupon information is not available.');
      return;
    }

    if (this.isSaving) {
      return;
    }

    const formValue = this.couponForm.value;

    const selectedCouponType = this.couponTypes.find(couponType =>
      couponType.couponTypeId === Number(formValue.couponTypeId)
    );

    if (!selectedCouponType) {
      this.alertService.error('Please select a valid coupon type.');
      return;
    }

    const startDate = new Date(formValue.startDate);
    const expiryDate = new Date(formValue.expiryDate);

    if (expiryDate <= startDate) {
      this.alertService.error('Expiry date must be later than start date.');
      return;
    }

    const discountValue = Number(formValue.discountValue);

    if (formValue.discountType === 'Percentage' && discountValue > 100) {
      this.alertService.error('Percentage discount cannot be greater than 100%.');
      return;
    }

    const currentUserId = this.authService.getCurrentUser()?.userId ? Number(this.authService.getCurrentUser()?.userId) : 1;

    const updatedCoupon: Coupon = {

      ...this.coupon,
      couponTypeId: Number(formValue.couponTypeId),
      couponTypeName: selectedCouponType.couponTypeName,
      couponCode: formValue.couponCode.trim().toUpperCase(),
      description: formValue.description?.trim() ?? '',
      startDate: formValue.startDate,
      expiryDate: formValue.expiryDate,
      discountType: formValue.discountType,
      discountValue: discountValue,
      isActive: formValue.isActive,
      modifiedBy: currentUserId,
      modifiedDate: new Date().toISOString()

    };

    console.log('Updating coupon:', updatedCoupon);

    this.isSaving = true;

    this.couponService.updateCoupon(this.couponId, updatedCoupon).subscribe({

      next: () => {
        this.isSaving = false;
        this.alertService.toastSuccess('Coupon updated successfully.');
        this.router.navigate(['/coupon-code']);
      },

      error: (error) => {
        this.isSaving = false;
        console.error('Error updating coupon:', error);
        const errorMessage = error?.error?.message || (typeof error?.error === 'string' ? error.error : null) || error?.error?.title || error?.message || 'Unable to update coupon.';
        this.alertService.error(errorMessage);
      }

    });
  }

  cancel(): void {
    this.router.navigate(['/coupon-code']);
  }
}