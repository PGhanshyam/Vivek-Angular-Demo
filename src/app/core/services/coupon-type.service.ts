import { Injectable } from '@angular/core';
import { CouponType } from '../models/coupon-type.model';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CouponTypeService {

    private readonly apiUrl = `${environment.apiUrl}/coupontypes`;

    private readonly defaultCouponTypes: CouponType[] = [
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

    constructor(
        private readonly http: HttpClient
    ) { }

    getCouponTypes(): Observable<CouponType[]> {

        return this.http.get<any>(
            this.apiUrl
        ).pipe(
            map(response => {
                let list: CouponType[] = [];
                if (Array.isArray(response)) list = response;
                else if (response && Array.isArray(response.data)) list = response.data;
                else if (response && Array.isArray(response.result)) list = response.result;
                else if (response && Array.isArray(response.items)) list = response.items;

                return list.length > 0 ? list : this.defaultCouponTypes;
            }),
            catchError((err) => {
                console.warn('Could not fetch coupon types from server, using default types:', err);
                return of(this.defaultCouponTypes);
            })
        );
    }
}
