export interface Coupon {
    couponId: number;
    couponTypeId: number;
    couponTypeName?: string;
    couponCode: string;
    description?: string | null;
    startDate: string;
    expiryDate: string;
    discountType?: string;
    discountValue: number;
    isActive: boolean;
    isDeleted?: boolean;
    createdBy?: number;
    createdDate?: string;
    modifiedBy?: number | null;
    modifiedDate?: string | null;
}