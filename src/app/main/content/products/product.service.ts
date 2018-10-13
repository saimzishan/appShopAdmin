import { ApiService } from "./../../../api/api.service";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { GLOBAL } from "./../../../shared/globel";
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
import { AuthGuard } from "../../../guard/auth.guard";
import { SnotifyService } from "ng-snotify";
import { Product } from "../models/product.model";

@Injectable()
export class ProductService extends ApiService {
  routeParams: any;
  category: any;
  onProductChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onCategoryChanged: BehaviorSubject<any> = new BehaviorSubject({});

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

  getProductWithSupplier(id, supplier_id) {
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
        "products?product_id=" +
        id +
        "&supplier_id=" +
        supplier_id,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getCategories(): Promise<any> {
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
        .get(GLOBAL.USER_API + "categories", httpOptions)
        .subscribe((response: any) => {
          this.category = response.data;
          this.onCategoryChanged.next(this.category);
          resolve(response);
        }, reject);
    });
  }

  saveProduct(product, option: string) {
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
      .put(
        GLOBAL.USER_API +
        "products/" +
        (option === "ps_update" ? product.ps_id : product.id) +
        "?" +
        option,
        product,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteOptionValue(ps_id: number, option_id: number) {
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
        GLOBAL.USER_API + "products/" + ps_id + "?ps_option=" + option_id,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  addProduct(product) {
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
      .post(GLOBAL.USER_API + "products", product, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getSupplier() {
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
      .get(GLOBAL.USER_API + "suppliers", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
  getTaxes() {
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
      .get(GLOBAL.USER_API + "taxes", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getTags() {
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
      .get(GLOBAL.USER_API + "tags", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getBrands() {
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
      .get(GLOBAL.USER_API + "brands", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getOptionSets() {
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
      .get(GLOBAL.USER_API + "optionsets", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteProduct(id: number) {
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
      .delete(GLOBAL.USER_API + "products/" + id + "?p_delete", httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deletePImage(id: number, image_id: number) {
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
      .delete(
        GLOBAL.USER_API +
        "products/" +
        id +
        "?p_image_id=" +
        image_id +
        "&p_image_delete",
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteProductVariantImage(variant_id: number, image_id: number) {
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
        "productVariants/" +
        variant_id +
        "?pv_image_delete&pv_image_id=" +
        image_id,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  updateProductVariant(product_id: number, variant: any): any {
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
      .put(
        GLOBAL.USER_API +
        "productVariants/" +
        product_id +
        "?ps_variant& psv_id=" +
        variant.id,
        variant,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteProductVariant(product_id: number, variant_id: number): any {
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
        "productVariants/" +
        product_id +
        "?pv_delete& pv_id=" +
        variant_id,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deletePBulkPrice(id: number, bulk_id: number) {
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
      .delete(
        GLOBAL.USER_API +
        "products/" +
        id +
        "?p_bulck_price" +
        "&bulck_p_id=" +
        bulk_id,
        httpOptions
      )
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
