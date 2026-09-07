import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  token = '';
  message = '';
  errorMessage = '';
  isLoading = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {

    this.form = this.formBuilder.group({

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

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage = 'Invalid reset link.';
    }
  }

  submit(): void {

    if (!this.token) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newPassword = this.form.value.newPassword ?? '';

    const confirmPassword = this.form.value.confirmPassword ?? '';

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.message = '';

    this.errorMessage = '';

    this.authService.resetPassword({
      resetToken: this.token,
      resetPasswordToken: this.token,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }).subscribe({
      next: (response: any) => {

        this.isLoading = false;

        if (response?.isSuccess !== false) {

          this.message = response?.message || 'Password reset successfully. Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);

        } else {
          this.errorMessage = response?.message || 'Password reset failed.';
        }
      },

      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || error?.error?.title || 'Password reset failed.';
      }

    });
  }

}