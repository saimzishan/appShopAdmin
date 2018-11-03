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
  products: any[];
  onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  // constructor(
  //     private http: HttpClient
  // )
  // {
  // }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

}
