import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { CouponService } from '../../../core/services/coupon.service';
import { CouponTypeService } from '../../../core/services/coupon-type.service';
import { AuthService } from '../../../core/services/auth.service';

import { CouponType } from '../../../core/models/coupon-type.model';
import { Coupon } from '../../../core/models/coupon.model';

import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-coupon-add.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coupon-add.component.html',
  styleUrl: './coupon-add.component.scss'
})
export class CouponAddComponent implements OnInit {

  couponForm: FormGroup;

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
    private readonly couponService: CouponService,
    private readonly couponTypeService: CouponTypeService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertService: AlertService
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
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Z0-9]+$/)
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
    },
      {
        validators: [
          this.dateRangeValidator,
          this.discountValidator
        ]
      }
    );
  }

  get formControls() {
    return this.couponForm.controls;
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {

    const startDate = control.get('startDate')?.value;
    const expiryDate = control.get('expiryDate')?.value;

    if (!startDate || !expiryDate) {
      return null;
    }

    const start = new Date(startDate);
    const expiry = new Date(expiryDate);

    if (expiry <= start) {
      return {
        invalidDateRange: true
      };
    }

    return null;
  }

  private discountValidator(control: AbstractControl): ValidationErrors | null {

    const discountType = control.get('discountType')?.value;
    const discountValue = Number(control.get('discountValue')?.value);

    if (!discountType || !discountValue) {
      return null;
    }

    if (discountType === 'Percentage' && discountValue > 100) {

      return {
        percentageExceeded: true
      };
    }

    return null;
  }

  ngOnInit(): void {
    this.loadCouponTypes();
  }

  loadCouponTypes(): void {

    this.isLoading = true;

    this.couponTypeService.getCouponTypes().subscribe({
      next: (response: CouponType[]) => {

        if (response && response.length > 0) {
          this.couponTypes = response;
        }

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Error loading coupon types:', error);
        this.isLoading = false;
      }

    });
  }

  get f() {
    return this.couponForm.controls;
  }

  autoGenerateCoupon(): void {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let coupon = '';

    for (let i = 0; i < 10; i++) {
      coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    this.couponForm.patchValue({
      couponCode: coupon
    });

  }

  saveCoupon(): void {

    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }

    if (this.isSaving) {
      return;
    }

    const formValue = this.couponForm.value;

    const selectedCouponType = this.couponTypes.find(type =>
      type.couponTypeId === Number(formValue.couponTypeId)
    );

    if (!selectedCouponType) {
      this.alertService.error('Please select a valid coupon type.');
      return;
    }

    // const startDate =
    //   new Date(
    //     formValue.startDate
    //   );

    // const expiryDate =
    //   new Date(
    //     formValue.expiryDate
    //   );


    // if (
    //   expiryDate <= startDate
    // ) {

    //   this.alertService.error(
    //     'Expiry date must be later than start date.'
    //   );

    //   return;

    // }

    const discountValue = Number(formValue.discountValue);

    // if (
    //   formValue.discountType ===
    //   'Percentage' &&
    //   discountValue > 100
    // ) {

    //   this.alertService.error(
    //     'Percentage discount cannot be greater than 100%.'
    //   );

    //   return;

    // }

    const currentUserId = this.authService.getCurrentUser()?.userId ? Number(this.authService.getCurrentUser()?.userId) : 1;

    const newCoupon: Coupon = {

      couponId: 0,
      couponTypeId: Number(formValue.couponTypeId),
      couponTypeName: selectedCouponType.couponTypeName,
      couponCode: formValue.couponCode.trim().toUpperCase(),
      description: formValue.description?.trim() || null,
      startDate: formValue.startDate,
      expiryDate: formValue.expiryDate,
      discountType: formValue.discountType,
      discountValue: discountValue,
      isActive: formValue.isActive ?? true,
      isDeleted: false,
      createdBy: currentUserId,
      createdDate: new Date().toISOString(),
      modifiedBy: null,
      modifiedDate: null

    };

    console.log('Creating coupon:', newCoupon);

    this.isSaving = true;

    this.couponService.addCoupon(newCoupon).subscribe({

      next: (response: any) => {
        this.isSaving = false;
        this.alertService.toastSuccess(response?.message || 'Coupon created successfully.');
        this.router.navigate(['/coupon-code']);
      },

      error: (error) => {
        this.isSaving = false;
        console.error('Error creating coupon:', error);
        const errorMessage = error?.error?.message || (typeof error?.error === 'string' ? error.error : null) || error?.error?.title || error?.message || 'Unable to create coupon.';
        this.alertService.error(errorMessage);
      }

    });
  }
 
  cancel(): void {
    this.router.navigate(['/coupon-code']);
  }

}