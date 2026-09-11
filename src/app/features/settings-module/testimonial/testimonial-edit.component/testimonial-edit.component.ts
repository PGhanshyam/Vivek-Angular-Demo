import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-testimonial-edit.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './testimonial-edit.component.html',
  styleUrl: './testimonial-edit.component.scss',
})
export class TestimonialEditComponent {

  testimonialForm: FormGroup;

  testimonialId!: number;

  isLoading = false;

  isSaving = false;


  constructor(
    private readonly formBuilder: FormBuilder,

    private readonly settingsService:
      SettingsService,

    private readonly route:
      ActivatedRoute,

    private readonly router:
      Router,

    private readonly alertService:
      AlertService
  ) {

    this.testimonialForm =
      this.formBuilder.group({

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
          1,
          [
            Validators.min(1)
          ]
        ]

      });

  }


  ngOnInit(): void {

    this.getTestimonialId();

  }


  /**
   * Get testimonial ID from route
   *
   * /settings/testimonials/edit/:id
   */
  private getTestimonialId(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.alertService.toastError(
        'Invalid testimonial ID.'
      );

      this.goBack();

      return;
    }


    this.testimonialId =
      Number(id);


    if (
      !this.testimonialId ||
      this.testimonialId <= 0
    ) {

      this.alertService.toastError(
        'Invalid testimonial ID.'
      );

      this.goBack();

      return;
    }


    this.loadTestimonial();

  }


  /**
   * Load existing testimonial
   */
  private loadTestimonial(): void {

    this.isLoading = true;


    this.settingsService
      .getTestimonialById(this.testimonialId)
      .subscribe({

        next: (response: any) => {

          this.isLoading = false;


          const testimonial =
            response?.data ??
            response;


          if (!testimonial) {

            this.alertService.toastError(
              'Testimonial not found.'
            );

            this.goBack();

            return;
          }


          this.testimonialForm.patchValue({

            content:
              testimonial.content ?? testimonial.Content ?? '',

            author:
              testimonial.author ?? testimonial.Author ?? '',

            displayOrder:
              testimonial.displayOrder ?? testimonial.DisplayOrder ?? 1

          });

        },


        error: (error) => {

          this.isLoading = false;


          console.error(
            'Error loading testimonial:',
            error
          );


          this.alertService.toastError(

            error?.error?.message ??
            'Failed to load testimonial.'
          );


          this.goBack();

        }

      });

  }


  get formControls() {

    return this.testimonialForm.controls;

  }


  /**
   * Update testimonial
   */
  onSubmit(): void {

    if (this.testimonialForm.invalid) {

      this.testimonialForm.markAllAsTouched();

      return;
    }


    if (this.isSaving) {

      return;
    }


    const formValue =
      this.testimonialForm.value;

    const rawOrder = formValue.displayOrder;
    const parsedOrder = Number(rawOrder);
    const displayOrder = (rawOrder !== null && rawOrder !== undefined && rawOrder !== '' && !isNaN(parsedOrder) && parsedOrder >= 1)
      ? parsedOrder
      : 1;

    const request = {

      content:
        formValue.content.trim(),

      author:
        formValue.author.trim(),

      displayOrder: displayOrder

    };


    this.isSaving = true;


    this.alertService.loading(
      'Updating testimonial...'
    );


    this.settingsService
      .updateTestimonial(
        this.testimonialId,
        request
      )
      .subscribe({

        next: (response: any) => {

          this.isSaving = false;

          this.alertService.close();


          this.alertService.toastSuccess(

            response?.message ??
            'Testimonial updated successfully.'
          );


          this.goBack();

        },


        error: (error) => {

          this.isSaving = false;

          this.alertService.close();


          console.error(
            'Error updating testimonial:',
            error
          );


          const errorMessage =

            error?.error?.message ||

            (
              typeof error?.error === 'string'
                ? error.error
                : null
            ) ||

            error?.error?.title ||

            error?.message ||

            'Unable to update testimonial.';


          this.alertService.toastError(
            errorMessage
          );

        }

      });

  }


  /**
   * Cancel / Back
   */
  onCancel(): void {

    this.goBack();

  }


  private goBack(): void {

    this.router.navigate([
      '/settings/testimonials'
    ]);

  }

}
