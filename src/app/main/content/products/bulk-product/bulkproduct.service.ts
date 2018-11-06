import { GLOBAL } from ".././../../../shared/globel";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthGuard } from "../../../../guard/auth.guard";
import { ApiService } from "../../../../api/api.service";

@Injectable()
export class BulkProductService extends ApiService {

  store(bulkproduct) {
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
      .post(GLOBAL.USER_API + "bulkUploads", bulkproduct, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

}
