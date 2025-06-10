import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { GoogleLoginButtonComponent } from '@auth/pages/google-login-button/google-login-button.component';
import { SocialAuthHandlerService } from '@auth/services/social-auth-handler.service';

@Component({
  selector: 'register-page',
  imports: [ReactiveFormsModule, CommonModule, GoogleLoginButtonComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPositing = signal(false);

  authService = inject(AuthService);
  authHandler = inject(SocialAuthHandlerService);
  
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
  });
  onSubmit() {
    if (this.signupForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {}, 200);
      return;
    }
    const { email = '', password = '', username = '' } = this.signupForm.value;
    console.log({ email, password, username });
    this.authService
      .register(email!, password!, username!)
      .subscribe((response) => {
        if (response) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasError.set(true);
        setTimeout(() => {}, 200);
      });
  }
  onGoogleToken(token: string) {
    this.authHandler.handleGoogleSuccess(token);
  }

  onGoogleError(error: any) {
    this.authHandler.handleGoogleError(error);
  }
}
