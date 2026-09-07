import { Injectable } from '@angular/core';
import { Coupon } from '../models/coupon.model';
import { environment } from '../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    private readonly apiUrl = `${environment.apiUrl}/coupons`;

    constructor(
        private readonly http: HttpClient
    ) { }

    // getCoupons(): Observable<Coupon[]> {
    //     return this.http.get<Coupon[]>(
    //         this.apiUrl
    //     );
    // }

    getCoupons(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchText: string = '',
        couponTypeId?: number,
        isActive?: boolean,
        sortColumn: string = 'CouponCode',
        sortDirection: string = 'DESC'
    ): Observable<PagedResult<Coupon> | any> {

        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString())
            .set('sortColumn', sortColumn)
            .set('sortDirection', sortDirection);

        if (searchText) {
            params = params.set('searchText', searchText);
        }

        if (couponTypeId) {
            params = params.set('couponTypeId', couponTypeId.toString());
        }

        if (isActive !== undefined && isActive !== null) {
            params = params.set('isActive', isActive.toString());
        }

        return this.http.get<PagedResult<Coupon> | any>(
            this.apiUrl,
            { params }
        );
    }

    getCouponById(couponId: number): Observable<Coupon> {

        return this.http.get<Coupon>(
            `${this.apiUrl}/${couponId}`
        ).pipe(
            catchError(() => {
                // Fallback: if GET /coupons/{id} fails or returns 404, fetch coupons list and find matching coupon by ID
                return this.getCoupons(1, 1000).pipe(
                    map((response: any) => {
                        let rawList: any[] = [];
                        if (Array.isArray(response)) {
                            rawList = response;
                        } else if (response && Array.isArray(response.data)) {
                            rawList = response.data;
                        } else if (response && response.data && Array.isArray(response.data.items)) {
                            rawList = response.data.items;
                        } else if (response && response.data && Array.isArray(response.data.coupons)) {
                            rawList = response.data.coupons;
                        } else if (response && Array.isArray(response.coupons)) {
                            rawList = response.coupons;
                        } else if (response && Array.isArray(response.items)) {
                            rawList = response.items;
                        } else if (response && Array.isArray(response.result)) {
                            rawList = response.result;
                        }
                        const found = rawList.find((item: any) =>
                            Number(item.couponId ?? item.CouponId ?? item.coupon_id ?? item.id ?? item.Id) === Number(couponId)
                        );
                        if (!found) {
                            throw new Error('Coupon not found');
                        }
                        return found;
                    })
                );
            })
        );
    }

    addCoupon(newCoupon: any): Observable<any> {
        return this.http.post<any>(
            this.apiUrl, newCoupon
        );
    }

    updateCoupon(couponId: number, updatedCoupon: any): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/${couponId}`, updatedCoupon
        );
    }

    deleteCoupon(couponId: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}/${couponId}`
        );
    }
}
