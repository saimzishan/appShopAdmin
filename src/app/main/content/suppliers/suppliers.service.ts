import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { GLOBAL } from "../../../shared/globel";
import { ApiService } from "../../../api/api.service";
import { AuthGuard } from "../../../guard/auth.guard";

@Injectable()
export class SuppliersService extends ApiService {
  suppliers: any[];
  onSuppliersChanged: BehaviorSubject<any> = new BehaviorSubject({});
  // http: any;

  // constructor(
  //   private http: HttpClient
  // )
  // {
  // }

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
      Promise.all([this.getSuppliers()]).then(() => {
        resolve();
      }, reject);
    });
  }

  // getSuppliers(): Promise<any>
  // {
  //   return new Promise((resolve, reject) => {
  //     this.http.get('api/suppliers')
  //       .subscribe((response: any) => {
  //         this.suppliers = response;
  //         this.onProductsChanged.next(this.suppliers);
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  getSuppliers() {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: "Unauthorized"
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token
      })
    };
    return this.http
      .get(GLOBAL.USER_API + "suppliers", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
