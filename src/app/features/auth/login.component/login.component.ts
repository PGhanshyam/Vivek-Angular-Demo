import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isLoading = false;
  errorMessage = '';
  showPassword = false;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {

    this.loginForm = this.formBuilder.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    const request = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };

    this.authService.login(this.loginForm.value).subscribe({

      next: (response) => {
        this.isLoading = false;

        if (response.isSuccess) {
          this.alertService.toastSuccess('Login successfully.');
          const user = this.authService.getCurrentUser();

          if (user?.mustChangePassword) {
            this.router.navigate(['/change-password']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = response.message ?? 'Login failed.';
        }
      },

      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          error?.message ||
          'Unable to connect to the backend server. Please verify SSL certificate at https://localhost:7099.';
      }

    });

  }
}