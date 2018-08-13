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
        AuthGuard.decodeUserInfo();
        return Boolean(token && u);
    }

    public static decodeUserInfo() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let token;
        if (user) {
            token = user.access_token;           
        } 
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        console.log(decodedToken);
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
