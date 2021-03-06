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
import { AuthGuard } from "../../../guard/auth.guard";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class ProductsService extends ApiService {
  products: any[];
  onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  // constructor(
  //     private http: HttpClient
  // )
  // {
  // }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  // getProducts(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         let access_token = AuthGuard.getToken();
  //         if (access_token === undefined) {
  //             let error = {
  //                 message: 'Unauthorized'
  //             }
  //             return Observable.throw({ error: error });
  //         }
  //         const httpOptions = {
  //             headers: new HttpHeaders({
  //                 'Content-Type': 'application/json',
  //                 'Authorization': 'Bearer ' + access_token
  //             })
  //         };

  //         this.http.get(GLOBAL.USER_API + 'products', httpOptions)
  //             .subscribe((response: any) => {
  //                 this.products = response.data;
  //                 this.onProductsChanged.next(this.products);
  //                 resolve(response);
  //             }, reject);
  //     });
  // }

  getProducts(count) {
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
      .get(GLOBAL.USER_API + "products?count=" + count, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getProductsWithPage(page: number, count?) {
    let counting = '';
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
    if (count) {
      counting = '&count=' + count;
    }
    return this.http
      .get(GLOBAL.USER_API + "products?page=" + page + counting, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  isProductActive(state, p_id) {
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
      .put(GLOBAL.USER_API + "products/" + p_id + "?p_active", state, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getProductClassDetails(option: string) {
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
      .get(GLOBAL.USER_API + "products" + '?' + option, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  updateBulkProduct(obj, option) {
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
    if (option === 'bulkUploads/1?ps_bulk_update') {
      const ps = {
        ps: obj,
      };
      return this.http
        .put(GLOBAL.USER_API + option, ps, httpOptions)
        .map(this.extractData)
        .catch(err => {
          return this.handleError(err);
        });
    } else {
      return this.http
        .put(GLOBAL.USER_API + option, obj, httpOptions)
        .map(this.extractData)
        .catch(err => {
          return this.handleError(err);
        });
    }
  }

  searchbyWord(search) {
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
      .get(GLOBAL.USER_API + "products?search=" + search, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteAllProducts() {
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
      .delete(GLOBAL.USER_API + "products/2?delete_all_prod", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  trackInventoryUpdate(obj) {
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
      .put(GLOBAL.USER_API + "bulkUploads/" + obj.id + "?ps_track_stack_update", obj , httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

}
