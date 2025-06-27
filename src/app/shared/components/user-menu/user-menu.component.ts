import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './user-menu.component.html',
})
export class UserMenuComponent {
  authService = inject(AuthService);
  router = inject(Router);
}
