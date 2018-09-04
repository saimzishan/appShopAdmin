import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../spinner/spinner.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";

@Injectable()
export class ApiService {
  constructor(
    protected http: HttpClient,
    protected spinnerService: SpinnerService,
    protected router: Router,
    protected snotifyService: SnotifyService
  ) {}
  /*
      Extract JSON Object from Response
    */
  protected extractData(res) {
    if (res && !res.error) {
      return { status: res.status, res };
    }
    return this.handleError(res);
  }

  /*
      The Error Handler from HTTP
    */
  protected handleError(error): any {
    return Observable.throw(error);
  }
}
