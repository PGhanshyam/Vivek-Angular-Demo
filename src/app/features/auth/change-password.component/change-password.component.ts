import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-change-password.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {

  isLoading = false;
  errorMessage = '';

  changePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {

    this.changePasswordForm =
      this.formBuilder.group({

        currentPassword: [
          '',
          [
            Validators.required
          ]
        ],

        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]

      });
  }

  changePassword(): void {

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({

      next: (response) => {
        this.isLoading = false;

        if (response.isSuccess) {
          this.alertService.toastSuccess('Password changed successfully.');
          const user = this.authService.getCurrentUser();
          if (user) {
            user.mustChangePassword = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.router.navigate(['/dashboard']);
        }
        else {
          this.errorMessage = response.message ?? 'Unable to change password.';
        }
      },

      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message ?? 'Unable to change password.';
      }

    });
  }
}
