import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  isProfileMenuOpen = false;
  userName = 'User';
  userAvatarUrl = 'assets/images/profile.jpg';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.loadUser();
  }

  loadUser(): void {

    const user = this.authService.getCurrentUser();

    if (user) {
      this.userName = `${user.firstName}${user.lastName}`;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  async logout(): Promise<void> {

    const confirmed = await this.alertService.confirmLogout();

    if (!confirmed) {
      return;
    }

    this.authService.logout();

    this.alertService.toastSuccess('Logged out successfully.');

    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (!target.closest('.profile-area')) {
      this.isProfileMenuOpen = false;
    }
  }
}
