import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpHeaders } from "@angular/common/http";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";
import { ApiService } from "../../../api/api.service";

@Injectable()
export class SupplierService extends ApiService {
  getSupplierById(id: number) {
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
      .get(GLOBAL.USER_API + "suppliers/" + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
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

  editSupplier(supplier) {
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
      .put(GLOBAL.USER_API + "suppliers/" + supplier.id, supplier, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteSupplier(supplier_id) {
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
      .delete(GLOBAL.USER_API + "suppliers/" + supplier_id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteSupplierImage(supplier_id: number, image_id: number) {
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
      .delete(GLOBAL.USER_API + "suppliers/" + supplier_id + "?s_image_delete&s_image_id=" + image_id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
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
