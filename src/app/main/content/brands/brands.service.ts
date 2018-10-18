import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "../../../shared/globel";
import { ApiService } from "../../../api/api.service";
import { AuthGuard } from "../../../guard/auth.guard";

@Injectable()
export class BrandsService extends ApiService {

  getBrands() {
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
      .get(GLOBAL.USER_API + "brands", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
