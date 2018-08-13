import { ApiService } from './../../../api/api.service';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../shared/globel';

@Injectable()
export class UserManagementService extends ApiService {
    // onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    // /**
    //  * Resolve
    //  * @param {ActivatedRouteSnapshot} route
    //  * @param {RouterStateSnapshot} state
    //  * @returns {Observable<any> | Promise<any> | any}
    //  */
    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    //     return new Promise((resolve, reject) => {

    //         Promise.all([
    //             this.index()
    //         ]).then(
    //             () => {
    //                 resolve();
    //             },
    //             reject
    //         );
    //     });
    // }

    index(){
        const currntUser = JSON.parse(localStorage.getItem('currentUser'));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currntUser.access_token
            })
        };
        return this.http.get(GLOBAL.USER_API + 'users', httpOptions)
                    .map(this.extractData)
                    .catch((err) => { return this.handleError(err); }
                );
                        
    }
}
