import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { GoogleLoginButtonComponent } from '../google-login-button/google-login-button.component';
import { SocialAuthHandlerService } from '@auth/services/social-auth-handler.service';

@Component({
  selector: 'login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    GoogleLoginButtonComponent,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPositing = signal(false);
  showPassword = false;
  authService = inject(AuthService);
  authHandler = inject(SocialAuthHandlerService);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  togglePasswordVisibility() {
    this.showPassword = this.showPassword ? false : true;
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {}, 200);
      return;
    }
    const { email = '', password = '' } = this.loginForm.value;
    console.log({ email, password });
    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }
      this.hasError.set(true);
      setTimeout(() => {}, 200);
    });
    //Check Authentication
    //Register
    //LogOut
  }

  onGoogleToken(token: string) {
    this.authHandler.handleGoogleSuccess(token);
  }

  onGoogleError(error: any) {
    this.authHandler.handleGoogleError(error);
  }
}
