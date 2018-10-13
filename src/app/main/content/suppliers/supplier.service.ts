import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SpinnerService } from "../../../spinner/spinner.service";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";
import { SnotifyService } from "ng-snotify";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class SupplierService extends ApiService implements Resolve<any> {
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
        this.spinnerService.requestInProcess(true);
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
        this.http
          .get(
            GLOBAL.USER_API + "suppliers/" + this.routeParams.id,
            httpOptions
          )
          .subscribe((response: any) => {
            this.spinnerService.requestInProcess(false);
            this.supplier = response.data;
            this.onSupplierChanged.next(this.supplier);
            resolve(response);
          }, reject);
      }
    });
  }

  addSupplier(supplier) {
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
      .post(GLOBAL.USER_API + "suppliers", supplier, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteSuppler(supplier) {
    this.spinnerService.requestInProcess(true);
    return new Promise((resolve, reject) => {
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

      this.http
        .delete(GLOBAL.USER_API + "suppliers/" + supplier.id, httpOptions)
        .subscribe((response: any) => {
          this.spinnerService.requestInProcess(false);
          if (!response.error) {
            resolve(response);
            this.snotifyService.success("Supplier Deleted Successfully");
            this.router.navigate(["/suppliers"]);
          } else {
            this.snotifyService.error(response.error);
          }
        }, reject);
    });
  }

  saveSupplier(supplier) {
    this.spinnerService.requestInProcess(true);
    return new Promise((resolve, reject) => {
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
      this.http
        .put(
          GLOBAL.USER_API + "suppliers/" + supplier.id,
          supplier,
          httpOptions
        )
        .subscribe((response: any) => {
          this.spinnerService.requestInProcess(false);
          if (!response.error) {
            resolve(response);
            this.snotifyService.success("Supplier Updated Successfully");
          } else {
            this.snotifyService.error(response.error);
          }
        }, reject);
    });
  }

  getGermanyJson() {
    return this.http
      .get("assets/js/germany-state.json")
      .map((response: Response) => {
        return response;
      })
      .catch(error => {
        throw error.message || error;
      });
  }

  getCanadaJson() {
    return this.http
      .get("assets/js/canada-state.json")
      .map((response: Response) => {
        return response;
      })
      .catch(error => {
        throw error.message || error;
      });
  }
}
