import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GLOBAL } from '../../../shared/globel';
import { ApiService } from '../../../api/api.service';
import { AuthGuard } from '../../../guard/auth.guard';

@Injectable()
export class OptionsService extends ApiService {
  options: any[];
  onOptionsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getOptions()]).then(() => {
        resolve();
      }, reject);
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
      .get(GLOBAL.USER_API + 'optionsets', httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
