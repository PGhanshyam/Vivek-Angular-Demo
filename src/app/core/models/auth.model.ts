export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    isSuccess: boolean;
    message: string;
    data: LoginData;
    errors: string[];
}

export interface LoginData {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    token: string;
    tokenExpiry: string;
    mustChangePassword: boolean;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    resetToken?: string;
    resetPasswordToken?: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T;
    errors: string[];
}