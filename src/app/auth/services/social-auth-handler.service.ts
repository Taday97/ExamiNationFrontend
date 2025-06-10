import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SocialAuthHandlerService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

   handleGoogleSuccess(idToken: string): void {
    console.log("onGoogleToken");
    this.authService.loginWithGoogle(idToken).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
      } else {
        console.error('Login with Google failed on backend');
      }
    });
  }

  onGoogleError(err: any): void {
    console.error('Google login failed at UI level', err);
  }

  handleGoogleError(error: any) {
    console.error(error);
  }
}
