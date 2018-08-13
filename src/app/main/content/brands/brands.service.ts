import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GLOBAL } from '../../../shared/globel';
import { ApiService } from '../../../api/api.service';

@Injectable()
export class BrandsService extends ApiService
{
    brands: any[];
    onBrandsChanged: BehaviorSubject<any> = new BehaviorSubject({});

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
                this.getBrands()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    // getBrands(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //         this.http.get('api/e-commerce-brands')
    //             .subscribe((response: any) => {
    //                 this.brands = response;
    //                 this.onBrandsChanged.next(this.brands);
    //                 resolve(response);
    //             }, reject);
    //     });
    // }

    getBrands(){
        const currntUser = JSON.parse(localStorage.getItem('currentUser'));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currntUser.access_token
            })
        };
        return this.http.get(GLOBAL.USER_API + 'brands', httpOptions)
                    .map(this.extractData)
                    .catch((err) => { return this.handleError(err); }
                );
                        
    }
}
