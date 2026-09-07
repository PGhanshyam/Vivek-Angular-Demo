import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, isActive, Router } from '@angular/router';

import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {

  editUserForm: FormGroup;
  userId = 0;
  selectedImage: string | null = null;
  selectedImageFile: File | null = null;
  user: User | null = null;

  roles = [

    {
      roleId: 1,
      roleName: 'Admin'
    },

    {
      roleId: 2,
      roleName:
        'Yoga Instructor'
    }

  ];

  countries = ['India', 'United Kingdom', 'United States'];

  states = ['Gujarat', 'Maharashtra', 'Merseyside', 'California'];

  cities = ['Ahmedabad', 'Surat', 'Mumbai', 'Prescot', 'London'];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly alertService: AlertService,
    private readonly cdr: ChangeDetectorRef
  ) {

    this.editUserForm = this.formBuilder.group({

      firstName: [
        '',
        [
          Validators.required
        ]
      ],

      lastName: [
        '',
        [
          Validators.required
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
          Validators.required
        ]
      ],

      country: [
        '',
        [
          Validators.required
        ]
      ],

      state: [
        '',
        [
          Validators.required
        ]
      ],

      city: [
        '',
        [
          Validators.required
        ]
      ],

      zipCode: [
        '',
        [
          Validators.required
        ]
      ],

      isActive: [true]
    });
  }

  ngOnInit(): void {

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId) {
      this.alertService.error('Invalid user id.');
      this.cancel();
      return;
    }

    this.loadUser();
  }

  private loadUser(): void {

    this.alertService.loading('Loading user...');

    this.userService.getUserById(this.userId).subscribe({

      next: (response: any) => {
        this.alertService.close();
        const item = response?.data ?? response?.user ?? response?.result ?? response;
        if (item) {
          const roleId = Number(item.roleId ?? item.RoleId ?? item.role_id ?? 0);
          let roleName = item.roleName ?? item.RoleName ?? item.role_name ?? (item.role?.roleName ?? item.role?.RoleName ?? '');
          if (!roleName) {
            if (roleId === 1) roleName = 'Admin';
            else if (roleId === 2) roleName = 'Yoga Instructor';
            else roleName = 'User';
          }
          const rawActive = item.isActive ?? item.IsActive ?? item.is_active ?? item.status;
          this.user = {
            userId: Number(item.userId ?? item.UserId ?? item.user_id ?? item.id ?? item.Id ?? this.userId),
            roleId: roleId,
            roleName: roleName,
            firstName: String(item.firstName ?? item.FirstName ?? item.first_name ?? ''),
            lastName: String(item.lastName ?? item.LastName ?? item.last_name ?? ''),
            email: String(item.email ?? item.Email ?? ''),
            phoneNo: String(item.phoneNo ?? item.PhoneNo ?? item.phone_no ?? item.phone ?? ''),
            profileImage: this.userService.getImageUrl(item.profileImage ?? item.ProfileImage ?? item.profile_image),
            address: String(item.address ?? item.Address ?? ''),
            country: String(item.country ?? item.Country ?? ''),
            state: String(item.state ?? item.State ?? ''),
            city: String(item.city ?? item.City ?? ''),
            zipCode: String(item.zipCode ?? item.ZipCode ?? item.zip_code ?? ''),
            isActive: rawActive === undefined || rawActive === null ? true : (rawActive === true || rawActive === 1 || String(rawActive).toLowerCase() === 'true'),
            createdDate: String(item.createdDate ?? item.CreatedDate ?? item.created_date ?? '')
          };

          this.editUserForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            roleId: this.user.roleId,
            email: this.user.email,
            phoneNo: this.user.phoneNo,
            address: this.user.address,
            country: this.user.country,
            state: this.user.state,
            city: this.user.city,
            zipCode: this.user.zipCode,
            isActive: this.user.isActive
          });

          if (this.user.profileImage) {
            this.selectedImage = this.user.profileImage;
          }

          this.cdr.markForCheck();
          try {
            this.cdr.detectChanges();
          } catch (e) { }
        }
      },

      error: () => {
        this.alertService.close();
        this.alertService.error('Unable to load user.');
        this.cancel();
      }

    });
  }

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.alertService.error('Please select a valid image file.');
      input.value = '';
      return;
    }

    const maximumFileSize = 5 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      this.alertService.error('Image size must not be greater than 5 MB.');
      input.value = '';
      return;
    }

    this.selectedImageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  updateUser(): void {

    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    if (!this.user) {
      return;
    }

    const formData = new FormData();

    formData.append('RoleId', this.editUserForm.value.roleId.toString());
    formData.append('FirstName', this.editUserForm.value.firstName.trim());
    formData.append('LastName', this.editUserForm.value.lastName.trim());
    formData.append('Email', this.editUserForm.value.email.trim().toLowerCase());
    formData.append('PhoneNo', this.editUserForm.value.phoneNo.trim());
    formData.append('Address', this.editUserForm.value.address.trim());
    formData.append('Country', this.editUserForm.value.country);
    formData.append('State', this.editUserForm.value.state);
    formData.append('City', this.editUserForm.value.city);
    formData.append('ZipCode', this.editUserForm.value.zipCode.trim());

    const isActive = this.editUserForm.value.isActive !== undefined && this.editUserForm.value.isActive !== null
      ? Boolean(this.editUserForm.value.isActive)
      : true;

    formData.append('IsActive', isActive.toString());

    if (this.selectedImageFile) {
      formData.append('ProfileImage', this.selectedImageFile, this.selectedImageFile.name);
    }

    this.alertService.loading('Updating user...');

    this.userService.updateUser(this.userId, formData).subscribe({

      next: (response) => {
        this.alertService.close();
        this.alertService.toastSuccess(response.message ?? 'User updated successfully.');
        this.router.navigate(['/user-management']);
      },

      error: (error) => {
        console.error(error);
        this.alertService.close();
        this.alertService.error(error?.error?.message ?? 'Unable to update user.');
      }

    });
  }

  cancel(): void {
    this.router.navigate(['/user-management']);
  }

  handleImageError(): void {
    this.selectedImage = null;
    this.cdr.markForCheck();
  }

}