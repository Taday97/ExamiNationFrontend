import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanActivateFn = async (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === 'authenticated') {
    return true;
  }

  if (authService.authStatus() === 'checking') {
    const isAuthenticated = await firstValueFrom(authService.checkStatus());
    if (isAuthenticated) return true;
    router.navigateByUrl('/login');
    return false;
  }

  router.navigateByUrl('/login');
  return false;
};
