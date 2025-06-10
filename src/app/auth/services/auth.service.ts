import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private http = inject(HttpClient);
  checkStatusResources = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });
  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
  isAdmin = computed(() => this._user()?.roles.includes('Admin') ?? false);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handelAuthSuccess(resp)),
        catchError((error: any) => this.handelAuthError(error))
      );
  }

  loginWithGoogle(idToken: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}/auth/google-login`, {
        idToken: idToken,
      })
      .pipe(
        map((resp) => this.handelAuthSuccess(resp)),
        catchError((error: any) => this.handelAuthError(error))
      );
  }
  register(
    email: string,
    password: string,
    username: string
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}/auth/register`, {
        email: email,
        password: password,
        username: username,
      })
      .pipe(
        map((resp) => this.handelAuthSuccess(resp)),
        catchError((error: any) => this.handelAuthError(error))
      );
  }
  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<AuthResponse>(`${environment.baseUrl}/auth/check-status`, {
        // headers:{
        //   Authorization:`Bearer ${token}`,
        // },
      })
      .pipe(
        tap((resp) => this.handelAuthSuccess(resp)),
        map(() => true),
        catchError((error: any) => this.handelAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }
  private handelAuthSuccess({ token, user }: AuthResponse) {
    console.log('Auth Success', { token, user });
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);
    return true;
  }
  private handelAuthError(error: any) {
    console.log(error);
    this.logout();
    return of(false);
  }
}
