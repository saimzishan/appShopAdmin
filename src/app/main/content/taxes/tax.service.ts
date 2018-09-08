import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GLOBAL } from '../../../shared/globel';
import { AuthGuard } from '../../../guard/auth.guard';
import { SnotifyService } from 'ng-snotify';
import { SpinnerService } from '../../../spinner/spinner.service';

@Injectable()
export class TaxService implements Resolve<any>
{
    routeParams: any;
    tax: any;
    onTaxChanged: BehaviorSubject<any> = new BehaviorSubject({});
    // router: any;

    constructor(
        private http: HttpClient,
        private snotifyService: SnotifyService,
        private spinnerService: SpinnerService,
        private router: Router

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
                this.getTax()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getTax(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {

                this.onTaxChanged.next(false);
                resolve(false);
            }
            else {
                this.spinnerService.requestInProcess(true);

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
                this.http.get(GLOBAL.USER_API + 'taxes/' + this.routeParams.id, httpOptions)
                    .subscribe((response: any) => {
                        this.spinnerService.requestInProcess(false);
                        this.tax = response.data.brand;
                        this.onTaxChanged.next(this.tax);
                        resolve(response);
                    }, reject);
            }
        });
    }

    saveTax(tax) {
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
            this.http.put(GLOBAL.USER_API + 'taxes/' + tax.id, tax, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Tax Updated Successfully');
                        this.router.navigate(['/taxes']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    deleteTax(tax) {
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

            this.http.delete(GLOBAL.USER_API + 'taxes/' + tax.id, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Brand Deleted Successfully');
                        this.router.navigate(['/taxes']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    addTax(tax) {
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

            this.http.post(GLOBAL.USER_API + 'taxes', tax, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Tax Added');
                        this.router.navigate(['/taxes']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }
}
