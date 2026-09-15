import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Coupon } from '../../../core/models/coupon.model';
import { CouponType } from '../../../core/models/coupon-type.model';
import { CouponService } from '../../../core/services/coupon.service';
import { CouponTypeService } from '../../../core/services/coupon-type.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './coupon-list.component.html',
  styleUrl: './coupon-list.component.scss'
})
export class CouponListComponent implements OnInit {

  searchText = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  selectedCouponType = '';
  selectedStatus = '';
  showFilterMenu = false;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  totalCount = 0;
  sortColumn = 'CouponCode';
  sortDirection: 'ASC' | 'DESC' = 'DESC';
  coupons: Coupon[] = [];
  couponTypes: CouponType[] = [];
  isLoading = false;

  constructor(
    private readonly couponService: CouponService,
    private readonly couponTypeService: CouponTypeService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCouponTypes();
    this.loadCoupons();
  }

  // Coupon Sorting

  onSort(column: string): void {

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }

    this.currentPage = 1;
    this.loadCoupons();
  }

  loadCouponTypes(): void {

    this.couponTypeService.getCouponTypes().subscribe({

      next: (response: any) => {
        if (Array.isArray(response)) {
          this.couponTypes = response;
        }
        else if (response && Array.isArray(response.data)) {
          this.couponTypes = response.data;
        }
        else {
          this.couponTypes = [];
        }
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error loading coupon types:', error);
        this.couponTypes = [];
        this.alertService.error('Unable to load coupon types.');
        this.cdr.markForCheck();
      }

    });
  }

  getCouponTypeName(couponTypeId: number): string {
    const type = this.couponTypes.find(item => item.couponTypeId === Number(couponTypeId));
    return type?.couponTypeName ?? '';
  }

  loadCoupons(): void {

    this.isLoading = true;
    const couponTypeId = this.getSelectedCouponTypeId();
    const isActive = this.getSelectedStatus();

    this.couponService.getCoupons(this.currentPage, this.pageSize, this.searchText, couponTypeId, isActive, this.sortColumn, this.sortDirection).subscribe({

      next: (response: any) => {
        const pagedData = response?.data ?? response;
        let rawList: any[] = [];
        if (Array.isArray(pagedData?.items)) {
          rawList = pagedData.items;
        }
        else if (Array.isArray(pagedData?.coupons)) {
          rawList = pagedData.coupons;
        }
        else if (Array.isArray(response?.data)) {
          rawList = response.data;
        }
        else if (Array.isArray(response)) {
          rawList = response;
        }
        this.coupons = rawList.map((item: any) => this.mapCoupon(item));
        this.totalCount = Number(pagedData?.totalCount ?? pagedData?.totalRecords ?? pagedData?.count ?? 0);
        this.currentPage = Number(pagedData?.pageNumber ?? pagedData?.currentPage ?? this.currentPage);
        this.pageSize = Number(pagedData?.pageSize ?? this.pageSize);
        this.isLoading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error loading coupons:', error);
        this.coupons = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.alertService.error(error?.error?.message ?? 'Unable to load coupons.');
        this.cdr.markForCheck();
      }

    });
  }

  private mapCoupon(item: any): Coupon {

    const couponTypeId = Number(item.couponTypeId ?? item.CouponTypeId ?? 0);
    const couponTypeName = String(item.couponTypeName ?? item.CouponTypeName ?? this.getCouponTypeName(couponTypeId) ?? '');
    const rawActive = item.isActive ?? item.IsActive;

    return {
      couponId: Number(item.couponId ?? item.CouponId ?? 0),
      couponTypeId: couponTypeId,
      couponTypeName: couponTypeName,
      couponCode: String(item.couponCode ?? item.CouponCode ?? ''),
      description: String(item.description ?? item.Description ?? ''),
      startDate: this.formatDate(item.startDate ?? item.StartDate),
      expiryDate: this.formatDate(item.expiryDate ?? item.ExpiryDate),
      discountType: String(item.discountType ?? item.DiscountType ?? ''),
      discountValue: Number(item.discountValue ?? item.DiscountValue ?? 0),
      isActive: rawActive === true || rawActive === 1 || String(rawActive).toLowerCase() === 'true',
      isDeleted: item.isDeleted ?? item.IsDeleted ?? false,
      createdBy: Number(item.createdBy ?? item.CreatedBy ?? 0),
      createdDate: String(item.createdDate ?? item.CreatedDate ?? ''),
      modifiedBy: item.modifiedBy ?? item.ModifiedBy ?? null,
      modifiedDate: item.modifiedDate ?? item.ModifiedDate ?? null
    };
  }

  formatDate(dateValue: any): string {

    if (!dateValue) {
      return '';
    }

    if (typeof dateValue === 'string') {
      const dateOnly = dateValue.split('T')[0];

      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        return dateOnly;
      }
    }

    try {
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) {
        return String(dateValue);
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    catch {
      return String(dateValue);
    }
  }

  private getSelectedCouponTypeId(): number | undefined {

    if (!this.selectedCouponType) {
      return undefined;
    }

    const couponTypeId = Number(this.selectedCouponType);

    if (Number.isNaN(couponTypeId)) {
      return undefined;
    }
    return couponTypeId;
  }

  private getSelectedStatus(): boolean | undefined {
    if (this.selectedStatus === 'active') {
      return true;
    }
    if (this.selectedStatus === 'inactive') {
      return false;
    }
    return undefined;
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadCoupons();
    },
      500
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCoupons();
  }

  get totalPages(): number {
    if (this.totalCount === 0) {
      return 1;
    }
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadCoupons();
  }

  previousPage(): void {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.loadCoupons();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.loadCoupons();
  }

  changePageSize(): void {
    this.currentPage = 1;
    this.loadCoupons();
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCouponType = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.showFilterMenu = false;
    this.loadCoupons();
  }

  viewCoupon(coupon: Coupon): void {
    this.router.navigate(['/coupon-code/view', coupon.couponId]);
  }

  editCoupon(coupon: Coupon): void {
    this.router.navigate(['/coupon-code/edit', coupon.couponId]);
  }

  async deleteCoupon(couponId: number): Promise<void> {

    const confirmed = await this.alertService.confirmDeleteWithCoupon('coupon');

    if (!confirmed) {
      return;
    }

    this.alertService.loading('Deleting coupon...');
    this.couponService.deleteCoupon(couponId).subscribe({

      next: () => {
        this.alertService.close();
        this.alertService.toastSuccess('Coupon deleted successfully.');
        if (this.coupons.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.loadCoupons();
      },

      error: (error) => {
        console.error('Error deleting coupon:', error);
        this.alertService.close();
        const errorMessage = error?.error?.message ?? error?.error?.title ?? error?.message ?? 'Unable to delete coupon.';
        this.alertService.error(errorMessage);
      }

    });
  }
}