import { GLOBAL } from "./../../../shared/globel";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../../api/api.service";
import { AuthGuard } from "../../../guard/auth.guard";

@Injectable()
export class CategoriesService extends ApiService {
  getCategories() {
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
      .get(GLOBAL.USER_API + "categories", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getCategoryById(id) {
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
      .get(GLOBAL.USER_API + "categories/" + id + "?edit", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  edit(id) {
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
      .get(GLOBAL.USER_API + "categories/" + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
