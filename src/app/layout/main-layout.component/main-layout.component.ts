import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar.component/sidebar.component';
import { HeaderComponent } from '../header.component/header.component';

@Component({
  selector: 'app-main-layout.component',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent { }
