import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SettingsService } from '../../../core/services/settings.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-general-settings.component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
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

    this.settingsService.getGeneralSettings().subscribe({

      next: (response) => {
        this.isLoading = false;
        const data = response?.data ?? response?.Data ?? response;
        if (data) {
          this.generalSettingsForm.patchValue({
            adminEmail: data.adminEmail ?? data.AdminEmail ?? '',
            taxPercentage: data.taxPercentage ?? data.TaxPercentage ?? 0,
            facebookUrl: data.facebookUrl ?? data.FacebookUrl ?? '',
            twitterUrl: data.twitterUrl ?? data.TwitterUrl ?? '',
            instagramUrl: data.instagramUrl ?? data.InstagramUrl ?? '',
            youtubeUrl: data.youtubeUrl ?? data.YoutubeUrl ?? ''
          });
        }
      },

      error: (error) => {
        this.isLoading = false;
        console.error('Error loading general settings:', error);
        // If 404 or missing, form defaults remain available for initial setup
        if (error?.status !== 404) {
          this.alertService.error('Failed to load general settings.');
        }
      }

    });
  }

  updateGeneralSettings(): void {

    if (this.generalSettingsForm.invalid) {
      this.generalSettingsForm.markAllAsTouched();
      return;
    }

    const rawTax = String(this.generalSettingsForm.value.taxPercentage ?? 0).replace(/[^0-9.]/g, '');
    const taxNum = parseFloat(rawTax) || 0;

    const request = {
      adminEmail: this.generalSettingsForm.value.adminEmail,
      taxPercentage: taxNum,
      facebookUrl: this.generalSettingsForm.value.facebookUrl || null,
      twitterUrl: this.generalSettingsForm.value.twitterUrl || null,
      instagramUrl: this.generalSettingsForm.value.instagramUrl || null,
      youtubeUrl: this.generalSettingsForm.value.youtubeUrl || null
    };

    this.alertService.loading('Updating settings...');

    this.settingsService.updateGeneralSettings(request).subscribe({

      next: (response) => {
        this.alertService.close();
        this.alertService.toastSuccess('General settings updated successfully.');
      },

      error: (error) => {
        this.alertService.close();
        console.error('Error updating general settings:', error);
        const errMsg = error?.error?.message || error?.error?.title || 'Failed to update general settings.';
        this.alertService.error(errMsg);
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
