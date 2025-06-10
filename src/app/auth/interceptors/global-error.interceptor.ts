import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn
} from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export function globalErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
       if (error.status === 401) {
          router.navigate(['/auth/login']);
        } else if (error.status === 404) {
          router.navigate(['/not-found']);
        }
        else if (error.status === 403) {
          router.navigate(['/forbidden']);
        }
      return throwError(() => error);
    })
  );

}
