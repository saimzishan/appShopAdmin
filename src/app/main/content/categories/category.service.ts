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

  update(category) {
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
      .put(GLOBAL.USER_API + "categories/" + category.id, category, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
  delete(id) {
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
      .delete(GLOBAL.USER_API + "categories/" + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteImage(category) {
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
      .delete(
        GLOBAL.USER_API +
          "categories/" +
          category.id +
          "?c_image_delete&c_image_id=" +
          category.imageId,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
