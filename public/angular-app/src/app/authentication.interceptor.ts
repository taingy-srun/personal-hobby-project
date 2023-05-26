import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private _authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.method == environment.request_method_get) {
      return next.handle(request);
    }

    return next.handle(this.addAuthenticationHeader(request));
  }

  addAuthenticationHeader(request: HttpRequest<unknown>) {
     const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + this._authenticationService.token
      }
    });

    return modifiedRequest;
  }
}
