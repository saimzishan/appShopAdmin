import { GLOBAL } from "./../../../shared/globel";
import { AuthGuard } from "./../../../guard/auth.guard";
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
export class CategoryService extends ApiService implements Resolve<any> {
  routeParams: any;
  supplier: any;
  onSupplierChanged: BehaviorSubject<any> = new BehaviorSubject({});

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
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {
      Promise.all([this.getSupplier()]).then(() => {
        resolve();
      }, reject);
    });
  }

  getSupplier(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === "new") {
        this.onSupplierChanged.next(false);
        resolve(false);
      } else {
        this.http
          .get("api/suppliers/" + this.routeParams.id)
          .subscribe((response: any) => {
            this.supplier = response;
            this.onSupplierChanged.next(this.supplier);
            resolve(response);
          }, reject);
      }
    });
  }

  saveSupplier(supplier) {
    return new Promise((resolve, reject) => {
      this.http
        .post("api/suppliers/" + supplier.id, supplier)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addSupplier(supplier) {
    return new Promise((resolve, reject) => {
      this.http.post("api/suppliers/", supplier).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  store(category) {
    let access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      let error = {
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
      .post(GLOBAL.USER_API + "categories", category, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
