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

@Injectable()
export class TagService extends ApiService implements Resolve<any>
{
    routeParams: any;
    tag: any;
    onTagChanged: BehaviorSubject<any> = new BehaviorSubject({});
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
                this.getTag()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getTag(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {

                this.onTagChanged.next(false);
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
                this.http.get(GLOBAL.USER_API + 'tags/' + this.routeParams.id, httpOptions)
                    .subscribe((response: any) => {
                        this.spinnerService.requestInProcess(false);
                        this.tag = response.data;
                        this.onTagChanged.next(this.tag);
                        resolve(response);
                    }, reject);
            }
        });
    }

    saveTag(tag) {
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
            this.http.put(GLOBAL.USER_API + 'tags/' + tag.id , tag , httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Tag Updated Successfully');
                        this.router.navigate(['/brands']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    deleteTag(tag) {
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

            this.http.delete(GLOBAL.USER_API + 'tags/' + tag.id , httpOptions)
                .subscribe((response: any) => {
                    this.spinnerService.requestInProcess(false);
                    if (!response.error) {
                        resolve(response);
                        this.snotifyService.success('Tag Deleted Successfully');
                        this.router.navigate(['/tags']);
                    }
                    else {
                        this.snotifyService.error(response.error);
                    }
                }, reject);
        });
    }

    addTag(tag) {
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
          .post(GLOBAL.USER_API + 'tags', tag, httpOptions)
          .map(this.extractData)
          .catch(err => {
            return this.handleError(err);
          });
      }
}
