import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent {

  userForm: FormGroup;
  profileImagePreview: string | null = null;
  selectedProfileImage: File | null = null;

  roles = [
    {
      roleId: 1,
      roleName: 'Admin'
    },
    {
      roleId: 2,
      roleName: 'Yoga Instructor'
    }
  ];

  countries = ['India', 'United States', 'United Kingdom', 'Canada'];

  states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi'];

  cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai', 'Pune'];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {

    this.userForm = this.formBuilder.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      roleId: [
        '',
        [
          Validators.required
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phoneNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(250)
        ]
      ],

      country: [
        '',
        Validators.required
      ],

      state: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      zipCode: [
        '',
        [
          Validators.required,
          // Validators.maxLength(10),
          // Validators.pattern(/^\d{5}(-\d{4})? |[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d | \d{4} | /^\d{6}$/)
          Validators.pattern(/^(?:\d{6}|\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d|\d{4})$/)
        ]
      ],

      isActive: [
        true
      ]
    });
  }

  get formControls() {
    return this.userForm.controls;
  }

  onProfileImageChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate image type
    if (!file.type.startsWith('image/')) {
      this.alertService.error('Please select a valid image file.');
      input.value = '';
      return;
    }

    // Maximum 5 MB
    const maximumFileSize = 5 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      this.alertService.error('Image size must not be greater than 5 MB.');
      input.value = '';
      return;
    }

    this.selectedProfileImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.profileImagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeProfileImage(imageInput: HTMLInputElement): void {
    this.profileImagePreview = null;
    this.selectedProfileImage = null;
    imageInput.value = '';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('RoleId', this.userForm.value.roleId.toString());
    formData.append('FirstName', this.userForm.value.firstName.trim());
    formData.append('LastName', this.userForm.value.lastName.trim());
    formData.append('Email', this.userForm.value.email.trim().toLowerCase());
    formData.append('PhoneNo', this.userForm.value.phoneNo.trim());
    formData.append('Address', this.userForm.value.address.trim());
    formData.append('Country', this.userForm.value.country);
    formData.append('State', this.userForm.value.state);
    formData.append('City', this.userForm.value.city);
    formData.append('ZipCode', this.userForm.value.zipCode.trim());
    formData.append('IsActive', this.userForm.value.isActive.toString());

    if (this.selectedProfileImage) {
      formData.append('ProfileImage', this.selectedProfileImage, this.selectedProfileImage.name);
    }

    this.alertService.loading('Saving user...');

    this.userService.addUser(formData).subscribe({

      next: (response) => {
        this.alertService.close();
        this.alertService.toastSuccess(response.message ?? 'User added successfully.');

        this.userForm.reset({
          isActive: true
        });

        this.profileImagePreview = null;
        this.selectedProfileImage = null;
        this.router.navigate(['/user-management']);
      },

      error: (error) => {
        console.error('Error adding user:', error);
        this.alertService.close();
        const errorMessage = error?.error?.message || (typeof error?.error === 'string' ? error.error : null) || error?.error?.title || error?.message || 'Unable to add user.';
        this.alertService.error(errorMessage);
      }

    });
  }

  closeModal(): void {
    this.router.navigate(['/user-management']);
  }

  onCancel(): void {
    this.closeModal();
  }
}