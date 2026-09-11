import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings.service';
import { AlertService } from '../../../../core/services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-list.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.scss',
})
export class TestimonialListComponent implements OnInit {

  testimonials: any[] = [];

  isLoading = false;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadTestimonials();
  }

  /**
   * Get all testimonials
   */
  loadTestimonials(): void {

    this.isLoading = true;

    this.settingsService.getTestimonials()
      .subscribe({
        next: (response: any) => {

          const rawData = response?.data ?? response?.Data ?? (Array.isArray(response) ? response : []);
          const list = Array.isArray(rawData) ? rawData : [];

          this.testimonials = list.sort((a: any, b: any) => {
            const orderA = Number(a?.displayOrder ?? a?.DisplayOrder ?? 0);
            const orderB = Number(b?.displayOrder ?? b?.DisplayOrder ?? 0);
            return orderA - orderB;
          });

          this.isLoading = false;
        },

        error: (error) => {

          this.isLoading = false;

          this.alertService.toastError(
            error?.error?.message ??
            'Failed to load testimonials.'
          );
        }
      });
  }

  /**
   * Navigate to Add Testimonial
   */
  addTestimonial(): void {

    const nextOrder = (this.testimonials?.length ?? 0) + 1;

    this.router.navigate(
      ['/settings/testimonials/add'],
      {
        state: { nextOrder }
      }
    );
  }

  /**
   * Navigate to Edit Testimonial
   */
  editTestimonial(id: number): void {

    this.router.navigate([
      '/settings/testimonials/edit',
      id
    ]);
  }

  /**
   * Delete Testimonial
   */
  async deleteTestimonial(id: number): Promise<void> {

    const confirmed =
      await this.alertService.confirmDelete('testimonial');

    if (!confirmed) {
      return;
    }

    this.settingsService
      .deleteTestimonial(id)
      .subscribe({
        next: () => {

          this.alertService.toastSuccess(
            'Testimonial deleted successfully.'
          );

          // Refresh list
          this.loadTestimonials();
        },

        error: (error) => {

          this.alertService.toastError(
            error?.error?.message ??
            'Failed to delete testimonial.'
          );
        }
      });
  }
}
