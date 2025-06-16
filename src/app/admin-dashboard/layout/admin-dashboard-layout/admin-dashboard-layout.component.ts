import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminTestsHeaderComponent } from "../../components/admin-tests-header/admin-tests-header.component";

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule, AdminTestsHeaderComponent],
  templateUrl: './admin-dashboard-layout.component.html',
  providers: [MessageService],
})
export class AdminDashboardLayoutComponent {
  constructor() {}
  authService = inject(AuthService);
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
