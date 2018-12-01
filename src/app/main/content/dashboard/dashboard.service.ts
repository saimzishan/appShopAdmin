import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../../api/api.service";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";

@Injectable()
export class DashboardService extends ApiService {
  projects: any[];
  widgets: any[];
  http: any;

  getDashboardInfo() {
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
      .get(GLOBAL.USER_API + "bulkUploads", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getOrderBetweenDates(dates) {
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
      .get(
        GLOBAL.USER_API +
          "orders/1?search&from=" +
          dates.from +
          "&to=" +
          dates.to,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
