import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  searchText = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  selectedRole = '';
  selectedStatus = '';
  showFilterMenu = false;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];
  totalCount = 0;
  sortColumn = 'FirstName';
  sortDirection: 'ASC' | 'DESC' = 'DESC';
  users: User[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    public readonly authService: AuthService
  ) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // User sorting method

  onSort(column: string): void {

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }

    this.currentPage = 1;
    this.loadUsers();
  }

  loadUsers(): void {

    const roleId = this.getSelectedRoleId();
    const isActive = this.getSelectedStatus();

    this.userService.getUsers(this.currentPage, this.pageSize, this.searchText, roleId, isActive, this.sortColumn, this.sortDirection)
      .subscribe({

        next: (response: any) => {
          const pagedData = response?.data ?? response?.Data ?? response?.result ?? response?.Result ?? response;

          let rawList: any[] = [];
          if (Array.isArray(pagedData?.items)) {
            rawList = pagedData.items;
          } else if (Array.isArray(pagedData?.Items)) {
            rawList = pagedData.Items;
          } else if (Array.isArray(pagedData?.users)) {
            rawList = pagedData.users;
          } else if (Array.isArray(pagedData?.Users)) {
            rawList = pagedData.Users;
          } else if (Array.isArray(pagedData?.data)) {
            rawList = pagedData.data;
          } else if (Array.isArray(pagedData?.Data)) {
            rawList = pagedData.Data;
          } else if (Array.isArray(pagedData)) {
            rawList = pagedData;
          }

          this.users = rawList.map((item: any) => this.mapUser(item));
          this.totalCount = Number(pagedData?.totalCount ?? pagedData?.TotalCount ?? pagedData?.total_count ?? pagedData?.total ?? pagedData?.Total ?? rawList.length);
          this.currentPage = Number(pagedData?.pageNumber ?? pagedData?.PageNumber ?? pagedData?.page_number ?? pagedData?.page ?? this.currentPage);
          this.pageSize = Number(pagedData?.pageSize ?? pagedData?.PageSize ?? pagedData?.page_size ?? this.pageSize);
          this.cdr.markForCheck();
          try {
            this.cdr.detectChanges();
          } catch (e) { }
        },

        error: (error) => {
          console.error('Failed to load users:', error);
          this.users = [];
          this.totalCount = 0;
          this.alertService.error(error?.error?.message ?? 'Unable to load users.');
          this.cdr.markForCheck();
          try {
            this.cdr.detectChanges();
          } catch (e) { }
        }

      });
  }

  private mapUser(item: any): User {
    if (!item || typeof item !== 'object') {
      return {
        userId: 0,
        roleId: 0,
        roleName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        profileImage: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        isActive: true,
        createdDate: ''
      };
    }

    const u = (item.user || item.User) && typeof (item.user || item.User) === 'object' ? (item.user || item.User) : item;

    const roleId = Number(u.roleId ?? u.RoleId ?? u.role_id ?? u.Role_Id ?? 0);

    let roleName = String(u.roleName ?? u.RoleName ?? u.role_name ?? u.role ?? '').trim();

    if (!roleName || roleName === '[object Object]') {
      if (roleId === 1) roleName = 'Admin';
      else if (roleId === 2) roleName = 'Yoga Instructor';
      else if (roleId > 0) roleName = 'User';
      else roleName = '';
    }

    const rawActive = u.isActive ?? u.IsActive ?? u.is_active ?? u.status ?? u.Status;

    return {
      userId: Number(u.userId ?? u.UserId ?? u.user_id ?? u.id ?? u.Id ?? 0),
      roleId: roleId,
      roleName: roleName,
      firstName: String(u.firstName ?? u.FirstName ?? u.first_name ?? u.firstname ?? '').trim(),
      lastName: String(u.lastName ?? u.LastName ?? u.last_name ?? u.lastname ?? '').trim(),
      email: String(u.email ?? u.Email ?? u.emailAddress ?? u.EmailAddress ?? '').trim(),
      phoneNo: String(u.phoneNo ?? u.PhoneNo ?? u.phone_no ?? u.phone ?? u.Phone ?? u.mobile ?? '').trim(),
      profileImage: this.userService.getImageUrl(u.profileImage ?? u.ProfileImage ?? u.profile_image ?? u.image ?? u.Image),
      address: String(u.address ?? u.Address ?? u.street ?? '').trim(),
      country: String(u.country ?? u.Country ?? '').trim(),
      state: String(u.state ?? u.State ?? '').trim(),
      city: String(u.city ?? u.City ?? '').trim(),
      zipCode: String(u.zipCode ?? u.ZipCode ?? u.zip_code ?? u.zip ?? '').trim(),
      isActive: rawActive === undefined || rawActive === null ? true : (rawActive === true || rawActive === 1 || String(rawActive).toLowerCase() === 'true' || String(rawActive).toLowerCase() === 'active'),
      createdDate: String(u.createdDate ?? u.CreatedDate ?? u.created_date ?? '').trim()
    };
  }

  private getSelectedRoleId(): number | undefined {
    if (!this.selectedRole) {
      return undefined;
    }
    const role = Number(this.selectedRole);
    return Number.isNaN(role) ? undefined : role;
  }

  private getSelectedStatus(): boolean | undefined {
    if (this.selectedStatus === 'active') {
      return true;
    }
    if (this.selectedStatus === 'inactive') {
      return false;
    }
    return undefined;
  }

  onSearchChange(): void {

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadUsers();
    },
      500
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  get totalPages(): number {
    if (this.totalCount === 0) {
      return 1;
    }
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number): void {

    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadUsers();
  }

  previousPage(): void {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.loadUsers();
  }

  changePageSize(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  // async deleteUser(userId: number): Promise<void> {

  //   const user = this.users.find(u => u.id === userId);
  //   const confirmed = await this.alertService.confirmDeleteWithDetails('user', user?.name ?? 'this user');
  //   if (!confirmed) {
  //     return;
  //   }
  //   this.alertService.loading('Deleting user...');

  //   this.userService.deleteUser(userId).subscribe({

  //     next: () => {
  //       this.alertService.close();
  //       this.alertService.toastSuccess('User deleted successfully.');
  //       if (this.users.length === 1 && this.currentPage > 1) {
  //         this.currentPage--;
  //       }
  //       this.loadUsers();
  //     },

  //     error: (error) => {
  //       console.error('Error deleting user:', error);
  //       this.alertService.close();
  //       const errorMessage = error?.error?.message ?? error?.error?.title ?? error?.message ?? 'Unable to delete user.';
  //       this.alertService.error(errorMessage);
  //     }

  //   });
  // }

  async deleteUser(userId: number): Promise<void> {
    const user = this.users.find(u => u.userId === userId);
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'this user';
    const confirmed = await this.alertService.confirmDeleteWithDetails('user', fullName, user?.profileImage);
    if (!confirmed) {
      return;
    }
    this.alertService.loading('Deleting user...');

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.toastSuccess('User deleted successfully.');
        if (this.users.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.alertService.close();
        const errorMessage = error?.error?.message ?? error?.error?.title ?? error?.message ?? 'Unable to delete user.';
        this.alertService.error(errorMessage);
      }
    });
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.showFilterMenu = false;
    this.loadUsers();
  }

  getInitials(user: User): string {
    const firstNameInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return (firstNameInitial + lastNameInitial);
  }

  handleImageError(user: User): void {
    user.profileImage = '';
    this.cdr.markForCheck();
  }

  viewUser(user: User): void {
    this.router.navigate(['/user-management/view', user.userId]);
  }

  editUser(user: User): void {
    this.router.navigate(['/user-management/edit', user.userId]);
  }

  get pageNumbers(): number[] {

    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;

  }

  getStartRecord(): number {

    if (this.totalCount === 0 || this.users.length === 0) {
      return 0;
    }

    return ((this.currentPage - 1) * this.pageSize) + 1;
  }

  getEndRecord(): number {

    if (this.totalCount === 0 || this.users.length === 0) {
      return 0;
    }

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalCount
    );
  }

}