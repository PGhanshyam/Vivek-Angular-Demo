import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environments';

import { ApiResponse, ChangePasswordRequest, ForgotPasswordRequest, LoginData, LoginRequest, ResetPasswordRequest } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly apiUrl = `${environment.apiUrl}/Auth`;

    constructor(
        private http: HttpClient
    ) { }

    login(request: LoginRequest): Observable<ApiResponse<LoginData>> {

        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, request)
            .pipe(tap(response => {

                if (response.isSuccess && response.data) {
                    const data: any = response.data;
                    const sessionData: LoginData = {
                        userId: Number(data.userId ?? data.UserId ?? 1),
                        firstName: String(data.firstName ?? data.FirstName ?? ''),
                        lastName: String(data.lastName ?? data.LastName ?? ''),
                        email: String(data.email ?? data.Email ?? request.email),
                        role: String(data.role ?? data.roleName ?? data.RoleName ?? 'Admin'),
                        token: String(data.token ?? data.Token ?? ''),
                        tokenExpiry: String(data.tokenExpiry ?? data.TokenExpiry ?? ''),
                        mustChangePassword: Boolean(data.mustChangePassword ?? data.MustChangePassword ?? false)
                    };

                    this.saveUserSession(sessionData);
                }
            })
            );
    }

    forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${this.apiUrl}/forgot-password`, request);
    }

    resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${this.apiUrl}/reset-password`, request);
    }

    changePassword(request: ChangePasswordRequest): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${this.apiUrl}/change-password`, request);
    }

    private saveUserSession(user: any): void {

        const token = user?.token || user?.accessToken || (typeof user === 'string' ? user : null);

        if (token) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('token', token);
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getToken(): string | null {

        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

        if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
            return null;
        }

        return token;
    }

    getCurrentUser(): LoginData | null {

        const user = localStorage.getItem('currentUser');

        if (!user) {
            return null;
        }

        return JSON.parse(user) as LoginData;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getUserRole():
        string | null {
        return this.getCurrentUser()?.role ?? null;
    }

    hasRole(allowedRoles: string[]): boolean {

        const userRole = this.getUserRole();

        if (!userRole) {
            return false;
        }

        return allowedRoles.includes(userRole);
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'Admin';
    }

    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    }
}