import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() { }

    // ===============================
    // Success Popup
    // ===============================

    success(message: string): void {

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            confirmButtonColor: '#d81b78'
        });

    }

    // ===============================
    // Error Popup
    // ===============================

    error(message: string): void {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#d81b78'
        });

    }

    // ===============================
    // Warning Popup
    // ===============================

    warning(message: string): void {

        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: message,
            confirmButtonColor: '#d81b78'
        });

    }

    // ===============================
    // Information Popup
    // ===============================

    info(message: string): void {

        Swal.fire({
            icon: 'info',
            title: 'Information',
            text: message,
            confirmButtonColor: '#d81b78'
        });

    }

    // ===============================
    // Success Toast
    // ===============================

    toastSuccess(message: string): void {

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

    }

    // ===============================
    // Error Toast
    // ===============================

    toastError(message: string): void {

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

    }

    // ===============================
    // Warning Toast
    // ===============================

    toastWarning(message: string): void {

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

    }

    // ===============================
    // Confirmation Dialog
    // ===============================

    async confirm(message: string): Promise<boolean> {

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d81b78',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        });

        return result.isConfirmed;

    }

    async confirmLogout(): Promise<boolean> {

        const result = await Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d81b78',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        });

        return result.isConfirmed;

    }

    // ===============================
    // Delete Confirmation
    // ===============================

    async confirmDelete(itemName: string): Promise<boolean> {

        const result = await Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure you want to delete this ${itemName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        });

        return result.isConfirmed;

    }

    // ===============================
    // Loading Popup
    // ===============================

    loading(message = 'Please wait...'): void {

        Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }

        });

    }

    // ===============================
    // Close Popup
    // ===============================

    close(): void {
        Swal.close();
    }
}
