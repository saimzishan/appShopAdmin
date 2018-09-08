import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GLOBAL } from '../../../shared/globel';
import { AuthGuard } from '../../../guard/auth.guard';
import { SnotifyService } from 'ng-snotify';
import { SpinnerService } from '../../../spinner/spinner.service';
import { ApiService } from '../../../api/api.service';
import { Option } from '../models/option.model';

@Injectable()
export class OptionService extends ApiService implements Resolve<any>
{
    routeParams: any;
    option: Option;
    option_values: any;
    onOptionChanged: BehaviorSubject<any> = new BehaviorSubject({});
    // router: any;

    // constructor(
    //     private http: HttpClient,
    //     private snotifyService: SnotifyService,
    //     private spinnerService: SpinnerService,
    //     private router: Router

    // ) {
    // }

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
                this.getOption()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getOption(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {

                this.onOptionChanged.next(false);
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
                this.http.get(GLOBAL.USER_API + 'optionsets/' + this.routeParams.id, httpOptions)
                    .subscribe((response: any) => {
                        this.spinnerService.requestInProcess(false);
                        this.option = new Option(response.data);
                        this.onOptionChanged.next(this.option);
                        resolve(response);
                    }, reject);
            }
        });
    }

    getOptions() {
        const access_token = AuthGuard.getToken();
        if (access_token === undefined) {
          const error = {
            message: 'Unauthorized'
          };
          return Observable.throw({ error: error });
        }
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + access_token
          })
        };
        return this.http
          .get(GLOBAL.USER_API + 'optionsets/' + this.routeParams.id , httpOptions)
          .map(this.extractData)
          .catch(err => {
            return this.handleError(err);
          });
      }

    saveOption(option) {
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
            this.http.put(GLOBAL.USER_API + 'optionsets/' + option.id, option, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Option Updated Successfully');
                        this.router.navigate(['/options']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    deleteOptions(option) {
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

            this.http.delete(GLOBAL.USER_API + 'optionsets/' + option.id, httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Option Deleted Successfully');
                        this.router.navigate(['/options']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    addOption(option) {
        // return new Promise((resolve, reject) => {
        const access_token = AuthGuard.getToken();
        if (access_token === undefined) {
            const error = {
                message: 'Unauthorized'
            };
            return Observable.throw({ error: error });
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + access_token
            })
        };

        //   this.http
        //     .post(GLOBAL.USER_API + 'products', product, httpOptions)
        //     .subscribe((response: any) => {
        //       console.log(response);
        //       resolve(response);
        //       this.router.navigate(['/products']);
        //     }, reject);
        // });
        return this.http
            .post(GLOBAL.USER_API + 'optionsets', option, httpOptions)
            // .post('http://61e9290d.ngrok.io/api/auth/' + 'optionsets', option, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }
}
