import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-testimonial-add.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './testimonial-add.component.html',
  styleUrl: './testimonial-add.component.scss',
})
export class TestimonialAddComponent {

  testimonialForm: FormGroup;
  isSaving = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly settingsService: SettingsService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {

    const initialOrder = history.state?.nextOrder ?? 1;

    this.testimonialForm = this.formBuilder.group({

      content: [
        '',
        [
          Validators.required,
          Validators.maxLength(5000)
        ]
      ],

      author: [
        '',
        [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],

      displayOrder: [
        initialOrder,
        [
          Validators.min(1)
        ]
      ]

    });
  }

  get formControls() {
    return this.testimonialForm.controls;
  }

  onSubmit(): void {

    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    if (this.isSaving) {
      return;
    }

    const formValue = this.testimonialForm.value;
    const rawOrder = formValue.displayOrder;
    const parsedOrder = Number(rawOrder);
    const displayOrder = (rawOrder !== null && rawOrder !== undefined && rawOrder !== '' && !isNaN(parsedOrder) && parsedOrder >= 1)
      ? parsedOrder
      : 1;

    const request = {
      content: formValue.content.trim(),
      author: formValue.author.trim(),
      displayOrder: displayOrder
    };

    this.isSaving = true;

    this.alertService.loading('Adding testimonial...');

    this.settingsService.createTestimonial(request).subscribe({

      next: (response) => {
        this.isSaving = false;
        this.alertService.close();
        this.alertService.toastSuccess(response?.message ?? 'Testimonial added successfully.');
        this.router.navigate(['/settings/testimonials']);
      },

      error: (error) => {
        this.isSaving = false;
        this.alertService.close();
        console.error('Error adding testimonial:', error);
        const errorMessage = error?.error?.message || (typeof error?.error === 'string' ? error.error : null) || error?.error?.title || error?.message || 'Unable to add testimonial.';
        this.alertService.error(errorMessage);
      }

    });
  }

  closeModal(): void {
    this.router.navigate(['/settings/testimonials']);
  }

  onCancel(): void {
    this.closeModal();
  }
}
