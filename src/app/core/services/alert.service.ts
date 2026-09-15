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

    // Delete Pop-up New 
    
    confirmDeleted(itemName: string = 'Content'): Promise<boolean> {

        return Swal.fire({
            title: 'Delete',

            html: `<div class="delete-confirmation-message">
                   Are you sure you want to remove<br>
                   this ${itemName}?
                  </div>`,

            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: false,
            buttonsStyling: false,

            customClass: {
                popup: 'custom-delete-popup',
                title: 'custom-delete-title',
                htmlContainer: 'custom-delete-message',
                confirmButton: 'custom-delete-yes',
                cancelButton: 'custom-delete-no',
                closeButton: 'custom-delete-close'
            },

            showCloseButton: true,
            focusConfirm: false,
            allowOutsideClick: false,

            allowEscapeKey: true
        }).then((result) => {
            return result.isConfirmed;
        });
    }

    confirmDeleteWithDetails(type: string, name: string, imageUrl?: string): Promise<boolean> {

        return Swal.fire({
            title: 'Delete',

            html: `<div class="delete-confirmation">
                     <div class="delete-message">
                       Are you sure you want to delete<br>
                       this ${type}?
                     </div>
                     
                     ${imageUrl ? `<img src="${imageUrl}" class="delete-profile-image" alt="${name}"/>`
                    : ''
                }

                     <div class="delete-name">
                       ${name}
                     </div>
                  </div>`,

            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false,

            customClass: {
                popup: 'delete-group',
                title: 'delete-popup-title',
                closeButton: 'delete-popup-close',
                htmlContainer: 'delete-popup-content',
                actions: 'delete-popup-actions',
                confirmButton: 'delete-popup-yes',
                cancelButton: 'delete-popup-no'
            },

            allowOutsideClick: false,
            allowEscapeKey: true,
            focusConfirm: false

        }).then(result => {
            return result.isConfirmed;
        });
    }

    async confirmDeleteWithCoupon(itemName: string): Promise<boolean> {

        const result = await Swal.fire({

            title: 'Delete',

            html: `
            <div class="delete-popup-content">

                <div class="delete-popup-icon">
                <!-- Coupon Cutout Vector -->
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#c82468" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
                   <line x1="9" y1="9" x2="9.01" y2="9"></line>
                   <line x1="15" y1="15" x2="15.01" y2="15"></line>
                   <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                </div>

                <div class="delete-popup-message">
                    Are you sure you want to delete<br>
                    this ${itemName}?
                </div>

            </div>
        `,

            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: false,

            customClass: {
                popup: 'custom-delete-popup',
                title: 'custom-delete-title',
                closeButton: 'custom-delete-close',
                htmlContainer: 'custom-delete-html',
                actions: 'custom-delete-actions',
                confirmButton: 'custom-delete-yes',
                cancelButton: 'custom-delete-no'
            },

            allowOutsideClick: false,
            allowEscapeKey: true,
            focusConfirm: false
        });

        return result.isConfirmed;
    }
}
