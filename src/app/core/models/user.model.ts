export interface User {
    userId: number;
    roleId: number;
    roleName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo?: string;
    profileImage?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    isActive: boolean;
    createdDate?: string;
}