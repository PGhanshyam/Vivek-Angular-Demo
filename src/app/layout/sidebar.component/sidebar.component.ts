import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  async logout(): Promise<void> {

    const confirmed = await this.alertService.confirmLogout();

    if (!confirmed) {
      return;
    }

    this.authService.logout();

    this.alertService.toastSuccess('Logged out successfully.');

    this.router.navigate(['/login']);
  }
  
}
