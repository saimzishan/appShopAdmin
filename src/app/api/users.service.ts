import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { GLOBAL } from '../shared/globel';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UsersService extends ApiService {
    isValidHttp(): boolean {
        return (this.http !== undefined || this.http !== null);
    }

    getInterpreterMessages(user_id, page): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return this.http.get(GLOBAL.USER_API + '/' + user_id + '/messages' + '?page=' + 1 + '&amp;per_page=' + page * 10, httpOptions)
            .map(this.extractData)
            .catch((err) => { return this.handleError(err); });
    }


    getLogin(obj): Observable<Object> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(GLOBAL.USER_API + 'login', obj, httpOptions)
            .map(this.extractData)
            .catch((err) => { return this.handleError(err); });
    }

        forgotPassword(obj): Observable<Object> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(GLOBAL.USER_API + 'forgotPassword', obj, httpOptions)
            .map(this.extractData)
            .catch((err) => { return this.handleError(err); });
    }

}

