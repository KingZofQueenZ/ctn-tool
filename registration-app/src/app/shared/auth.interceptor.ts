import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        const authReq = req.clone({
            headers: req.headers.set('x-access-token', currentUser.token)
        });

        return next.handle(authReq).pipe(
          catchError(this.handleError)
        );
    }
    return next.handle(req).pipe(
      catchError(this.handleError)
    );
  }

  public handleError = (error: Response) => {
    return Observable.throw(error);
  }
}
