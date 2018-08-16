import { SpinnerService } from './../../../spinner/spinner.service';
import { GLOBAL } from './../../../shared/globel';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthGuard } from '../../../guard/auth.guard';
import { SnotifyService } from 'ng-snotify';

@Injectable()
export class ProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    onProductChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private http: HttpClient,
        private spinnerService: SpinnerService,
        private router: Router,
        private snotifyService: SnotifyService
    ) {
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProduct(): Promise<any> {
        this.spinnerService.requestInProcess(true);
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.spinnerService.requestInProcess(false);
                this.onProductChanged.next(false);
                resolve(false);
            }
            else {
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

                this.http.get(GLOBAL.USER_API + 'products/' + this.routeParams.id, httpOptions)
                    .subscribe((response: any) => {
                        this.product = response.data;
                        this.spinnerService.requestInProcess(false);
                        this.onProductChanged.next(this.product);
                        resolve(response);
                    }, reject);
            }
        });
    }

    saveProduct(product) {
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

            this.http.put(GLOBAL.USER_API + 'products/' + product.id, product, httpOptions)
                .subscribe((response: any) => {
                    resolve(response);
                    this.router.navigate(['/products']);
                }, reject);
        });
    }

    addProduct(product) {
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

            this.http.post(GLOBAL.USER_API + 'products', product, httpOptions)
                .subscribe((response: any) => {
                    resolve(response);
                    this.router.navigate(['/products']);
                }, reject);
        });
    }

    deleteProduct(product) {
        this.spinnerService.requestInProcess(true);
        return new Promise((resolve, reject) => {
            const access_token = AuthGuard.getToken();
            if (access_token === undefined) {
                const error = {
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

            this.http.delete(GLOBAL.USER_API + 'products/' + product.id, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Product Deleted Successfully');
                        this.router.navigate(['/suppliers']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }
}
