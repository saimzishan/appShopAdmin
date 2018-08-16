import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CategoriesService implements Resolve<any>
{
  suppliers: any[];
  onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    private http: HttpClient
  )
  {
  }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getSuppliers()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getSuppliers(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.http.get('api/suppliers')
        .subscribe((response: any) => {
          this.suppliers = response;
          this.onProductsChanged.next(this.suppliers);
          resolve(response);
        }, reject);
    });
  }
}
