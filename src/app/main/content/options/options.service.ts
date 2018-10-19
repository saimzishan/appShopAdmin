import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GLOBAL } from '../../../shared/globel';
import { AuthGuard } from '../../../guard/auth.guard';
import { ApiService } from '../../../api/api.service';
import { Option } from '../models/option.model';

@Injectable()
export class OptionsService extends ApiService {
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
        return this.http.get(GLOBAL.USER_API + 'optionsets', httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    getOptionById(id: number) {
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
        return this.http.get(GLOBAL.USER_API + 'optionsets/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    addOption(option: Option) {
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
        return this.http.post(GLOBAL.USER_API + 'optionsets', option, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    editOption(option: Option) {
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
        return this.http.put(GLOBAL.USER_API + 'optionsets/' + option.id, option, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deleteOption(id: number) {
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
        return this.http.delete(GLOBAL.USER_API + 'optionsets/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deleteOptionValue(id: number) {
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
        return this.http.delete(GLOBAL.USER_API + 'options/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }
}
