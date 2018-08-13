import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
    public currentUser = false;
    constructor(private router: Router) { }
    public static isLoggedIn(): boolean {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let u = false;
        let token = false;
        if (user) {
            token = user.access_token;
            u =  Boolean(user);
           
        } 
        AuthGuard.isTokenExpired(token);
        return Boolean(token && u && !AuthGuard.isTokenExpired(token));
    }

    public static decodeUserInfo(token) {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
    }

    public static isTokenExpired(myRawToken): boolean {
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(myRawToken);
        return Boolean(isExpired);
    }

    public static logout(): boolean {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let u =  Boolean(user);
        return u;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
        if (!AuthGuard.isLoggedIn()) {
            this.router.navigate(['/pages/auth/login']);
        }
        return AuthGuard.isLoggedIn();
    }

}
