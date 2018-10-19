import { GLOBAL } from "./../../../shared/globel";
import { AuthGuard } from "./../../../guard/auth.guard";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from "@angular/common/http";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class CategoryService extends ApiService {

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
