import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {
    constructor(protected http: HttpClient ) {
    }
    /*
      Extract JSON Object from Response
    */
    protected extractData(res: Response) {
      if (res.status < 200 || res.status >= 300) {
        return this.handleError(res);
      }
      return { status: res.status , res};
    }

    /*
      The Error Handler from HTTP
    */
    protected handleError(error): any {
        return Observable.throw(error);
    }

}

