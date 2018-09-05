import { GLOBAL } from "./../../../shared/globel";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class CategoriesService extends ApiService implements Resolve<any> {
  suppliers: any[];
  onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});
  category: any;

  // constructor(private http: HttpClient) {}

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

  getSuppliers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get("api/suppliers").subscribe((response: any) => {
        this.suppliers = response;
        this.onProductsChanged.next(this.suppliers);
        resolve(response);
      }, reject);
    });
  }

  index(): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http
      .get(GLOBAL.USER_API + "categories", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
  getData(id) {
    return new Promise((resolve, reject) => {
      this.spinnerService.requestInProcess(true);
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      };
      this.http
        .get(GLOBAL.USER_API + "categories/" + id, httpOptions)
        .subscribe((response: any) => {
          this.spinnerService.requestInProcess(false);
          if (!response.error) {
            resolve(response);
          } else {
            this.snotifyService.error(response.error);
          }
        }, reject);
    });
  }

  show(id): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http
      .get(GLOBAL.USER_API + "categories/" + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
