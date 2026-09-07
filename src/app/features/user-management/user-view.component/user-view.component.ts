import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-user-view',
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})

export class UserViewComponent implements OnInit {

  userId = 0;
  isLoading = true;
  user: User | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly alertService: AlertService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.userId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.userId) {
      this.alertService.error('Invalid user id.');
      this.closeView();
      return;
    }

    this.loadUser();
  }

  private loadUser(): void {

    this.isLoading = true;

    this.alertService.loading('Loading user...');

    this.userService.getUserById(this.userId).subscribe({

      next: (response: any) => {
        this.isLoading = false;
        this.alertService.close();

        let item = response;
        if (item && typeof item === 'object') {
          if (Array.isArray(item)) {
            item = item[0];
          } else if (item.data) {
            item = Array.isArray(item.data) ? item.data[0] : item.data;
          } else if (item.user) {
            item = Array.isArray(item.user) ? item.user[0] : item.user;
          } else if (item.result) {
            item = Array.isArray(item.result) ? item.result[0] : item.result;
          }
        }

        if (item && typeof item === 'object') {
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
        } else {
          this.user = null;
        }
        this.cdr.markForCheck();
        try {
          this.cdr.detectChanges();
        } catch (e) { }
      },

      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.alertService.close();
        this.user = null;
        this.cdr.markForCheck();
      }

    });

  }

  handleImageError(): void {
    if (this.user) {
      this.user.profileImage = '';
      this.cdr.markForCheck();
    }
  }

  closeView(): void {
    this.router.navigate(['/user-management']);
  }

}