import { GLOBAL } from './../../../../../shared/globel';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthGuard } from '../../../../../guard/auth.guard';

@Injectable()
export class EcommerceProductsService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private http: HttpClient
    )
    {
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProducts()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProducts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let access_token = AuthGuard.getToken();
            if (access_token === undefined) {
                let error = {
                    message: 'Unauthorized'
                }
                return Observable.throw({ error: error });
            }
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                })
            };

            this.http.get(GLOBAL.USER_API + 'products', httpOptions)
                .subscribe((response: any) => {
                    this.products = response.data;
                    this.onProductsChanged.next(this.products);
                    resolve(response);
                }, reject);
        });
    }
}
