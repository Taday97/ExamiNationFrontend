import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const RedirectGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  await firstValueFrom(authService.checkStatus());
  console.log('RedirectGuard');
  if (state.url === '/') {
    if (authService.authStatus() === 'authenticated') {
      if (authService.isAdmin()) {
        router.navigate(['/admin/tests']);
        return false;
      } 
    }
  }

  return true;
};
