import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'Content-Type':'application/json',
                    'secure':'false',
                    //'Access-Control-Allow-Origin': "http://localhost:4200",
                    //'Access-Control-Allow-Credentials':'true',
                    //'Access-Control-Allow-Methods': "GET, POST, OPTIONS",
                     Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request);
    }
}