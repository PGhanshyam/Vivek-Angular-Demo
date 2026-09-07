import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly apiUrl = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient
    ) { }

    getImageUrl(path?: string | null): string {
        if (!path || typeof path !== 'string' || path.trim() === '' || path.trim().toLowerCase() === 'string' || path.trim().toLowerCase() === 'null') {
            return '';
        }
        const trimmed = path.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
            return trimmed;
        }
        const cleanPath = trimmed.startsWith('/') ? trimmed.substring(1) : trimmed;
        return `${environment.imageBaseUrl}/${cleanPath}`;
    }

    // getUsers(): Observable<User[]> {
    //     return this.http.get<User[]>(
    //         this.apiUrl
    //     );
    // }

    getUsers(
        pageNumber: number = 1,
        pageSize: number = 10,
        searchText: string = '',
        roleId?: number,
        isActive?: boolean,
        sortColumn: string = 'FirstName',
        sortDirection: string = 'DESC'
    ): Observable<PagedResult<User>> {

        let params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('sortColumn', sortColumn)
            .set('sortDirection', sortDirection);

        if (searchText.trim()) {
            params = params.set('searchText', searchText.trim());
        }

        if (roleId !== undefined && roleId !== null) {
            params = params.set('roleId', roleId);
        }

        if (isActive !== undefined && isActive !== null) {
            params = params.set('isActive', isActive);
        }

        return this.http.get<PagedResult<User>>(
            this.apiUrl,
            { params }
        );
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(
            `${this.apiUrl}/${userId}`
        ).pipe(
            catchError(() => {
                // Fallback: if GET /users/{id} fails or returns 404, fetch users list and find matching user by ID
                return this.getUsers().pipe(
                    map((response: any) => {
                        let rawList: any[] = [];
                        if (Array.isArray(response)) {
                            rawList = response;
                        } else if (response && Array.isArray(response.data)) {
                            rawList = response.data;
                        } else if (response && Array.isArray(response.users)) {
                            rawList = response.users;
                        } else if (response && Array.isArray(response.items)) {
                            rawList = response.items;
                        } else if (response && Array.isArray(response.result)) {
                            rawList = response.result;
                        }
                        const found = rawList.find(item =>
                            Number(item.userId ?? item.UserId ?? item.user_id ?? item.id ?? item.Id) === Number(userId)
                        );
                        if (!found) {
                            throw new Error('User not found');
                        }
                        return found;
                    })
                );
            })
        );
    }

    addUser(formData: FormData): Observable<any> {
        return this.http.post(
            this.apiUrl, formData
        );
    }

    updateUser(userId: number, formData: FormData): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/${userId}`, formData
        );
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/${userId}`
        );
    }

    // getNextUserId(): number {

    //     if (this.users.length === 0) {
    //         return 1;
    //     }

    //     return Math.max(...this.users.map(user => user.userId)) + 1;
    // }
}