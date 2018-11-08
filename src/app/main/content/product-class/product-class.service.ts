import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from "@angular/common/http";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class ProductClassService extends ApiService {

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

  updateClass(obj) {
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
      .put(GLOBAL.USER_API + "products/" + obj.ps_id + '?ps_class_update' , obj , httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

}
