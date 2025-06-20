import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminTestsHeaderComponent } from '../../components/admin-tests-header/admin-tests-header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [
    RouterOutlet,
    ToastModule,
    AdminTestsHeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './admin-dashboard-layout.component.html',
  providers: [MessageService],
})
export class AdminDashboardLayoutComponent {
   isSidebarOpen = signal(true);

  constructor() {}

  authService = inject(AuthService);

  onToggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
