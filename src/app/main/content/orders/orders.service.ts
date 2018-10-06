import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../shared/globel';
import { ApiService } from '../../../api/api.service';
import { AuthGuard } from '../../../guard/auth.guard';
import { Order } from '../models/order.model';

@Injectable()
export class OrdersService extends ApiService {

  //Order CRUD

  getOrders() {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: 'Unauthorized'
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      })
    };
    return this.http.get(GLOBAL.USER_API + 'orders', httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getOrderById(id: number) {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: 'Unauthorized'
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      })
    };
    return this.http.get(GLOBAL.USER_API + 'orders/' + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  addOrder(order: Order) {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: 'Unauthorized'
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      })
    };
    return this.http.post(GLOBAL.USER_API + 'orders', order, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  updateOrder(order: Order) {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: 'Unauthorized'
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      })
    };
    return this.http.put(GLOBAL.USER_API + 'orders/' + order.id, order, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteOrder(id: number) {
    const access_token = AuthGuard.getToken();
    if (access_token === undefined) {
      const error = {
        message: 'Unauthorized'
      };
      return Observable.throw({ error: error });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token
      })
    };
    return this.http.delete(GLOBAL.USER_API + 'orders/' + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
