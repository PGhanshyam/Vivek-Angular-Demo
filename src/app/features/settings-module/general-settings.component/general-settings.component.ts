import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../../core/services/settings.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-general-settings.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit {

  generalSettingsForm!: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadGeneralSettings();
  }

  private initializeForm(): void {
    this.generalSettingsForm = this.fb.group({
      adminEmail: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      taxPercentage: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],

      facebookUrl: [''],

      twitterUrl: [''],

      instagramUrl: [''],

      youtubeUrl: ['']
    });
  }

  private loadGeneralSettings(): void {

    this.isLoading = true;

    this.settingsService
      .getGeneralSettings()
      .subscribe({
        next: (response) => {

          this.isLoading = false;

          if (response) {
            this.generalSettingsForm.patchValue({
              adminEmail: response.adminEmail,
              taxPercentage: response.taxPercentage,
              facebookUrl: response.facebookUrl,
              twitterUrl: response.twitterUrl,
              instagramUrl: response.instagramUrl,
              youtubeUrl: response.youtubeUrl
            });
          }
        },

        error: (error) => {

          this.isLoading = false;

          console.error(
            'Error loading general settings:',
            error
          );

          this.alertService.error(
            'Failed to load general settings.'
          );
        }
      });
  }

  updateGeneralSettings(): void {

    if (this.generalSettingsForm.invalid) {

      this.generalSettingsForm.markAllAsTouched();

      return;
    }

    const request = {
      adminEmail:
        this.generalSettingsForm.value.adminEmail,

      taxPercentage:
        this.generalSettingsForm.value.taxPercentage,

      facebookUrl:
        this.generalSettingsForm.value.facebookUrl || null,

      twitterUrl:
        this.generalSettingsForm.value.twitterUrl || null,

      instagramUrl:
        this.generalSettingsForm.value.instagramUrl || null,

      youtubeUrl:
        this.generalSettingsForm.value.youtubeUrl || null
    };

    this.alertService.loading('Updating settings...');

    this.settingsService
      .updateGeneralSettings(request)
      .subscribe({
        next: (response) => {

          this.alertService.close();

          this.alertService.toastSuccess(
            'General settings updated successfully.'
          );
        },

        error: (error) => {

          this.alertService.close();

          console.error(
            'Error updating general settings:',
            error
          );

          this.alertService.error(
            'Failed to update general settings.'
          );
        }
      });
  }

  openPrivacyPolicy(): void {
    this.router.navigate(['/settings/privacy-policy']);
  }

  openTermsConditions(): void {
    this.router.navigate(['/settings/terms-conditions']);
  }

  openAbout(): void {
    this.router.navigate(['/settings/about']);
  }

  openTestimonial(): void {
    this.router.navigate(['/settings/testimonial']);
  }
}
