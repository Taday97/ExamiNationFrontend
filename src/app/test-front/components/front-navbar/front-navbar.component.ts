import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { UserMenuComponent } from "@shared/components/user-menu/user-menu.component";

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, UserMenuComponent],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isOnTestResultDetails(): boolean {
    return /^\/test-result\/[^\/]+\/details$/.test(this.router.url);
  }
}
