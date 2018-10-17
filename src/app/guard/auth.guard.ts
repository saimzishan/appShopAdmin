import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthGuard implements CanActivate {
    public currentUser = false;
    public static helper = new JwtHelperService();
    constructor(private router: Router) { }
    public static isLoggedIn(): boolean {
        let u = JSON.parse(localStorage.getItem('currentUser'));
        let token = AuthGuard.getToken();
        return Boolean(token !== undefined && u && !AuthGuard.isTokenExpired());
    }

    public static decodeUserInfo(token) {
        return this.helper.decodeToken(token);
    }

    public static isTokenExpired(): boolean {
        if (AuthGuard.getToken() === undefined) {
            return true;
        }
        const isExpired = this.helper.isTokenExpired(AuthGuard.getToken());
        return Boolean(isExpired);
    }

    public static getTokenExpirationDate() {
        if (AuthGuard.getToken() === undefined) {
            return false;
        }
        return this.helper.getTokenExpirationDate(AuthGuard.getToken())
    }
    public static getToken() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let token;
        if (user) {
            token = user.access_token;
        } 
        return token;
    }

    public static logout() {
       localStorage.clear();
       window.location.reload();
    }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      
        if (!AuthGuard.isLoggedIn()) {
            this.router.navigate(['/pages/auth/login']);
        }
        return AuthGuard.isLoggedIn();
    }

}
