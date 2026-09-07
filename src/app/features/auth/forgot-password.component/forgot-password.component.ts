import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  message = '';
  errorMessage = '';
  isLoading = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {

    this.form = this.formBuilder.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.message = '';

    this.errorMessage = '';

    this.authService.forgotPassword({
      email: (this.form.value.email || '').trim().toLowerCase()
    })
      .subscribe({

        next: response => {
          this.isLoading = false;
          this.message = response.message;
        },

        error: error => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message ?? 'Unable to process the request.';
        }

      });
  }
}