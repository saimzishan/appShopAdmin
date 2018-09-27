import { ApiService } from './../../../api/api.service';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../shared/globel';
import { AuthGuard } from '../../../guard/auth.guard';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';

@Injectable()
export class UserManagementService extends ApiService {
    // onProductsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    //Role CRUD

    getRoles() {
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
    return this.http.get(GLOBAL.USER_API + 'roles', httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
    }

    getRoleById(id: number) {}

    addRole(role: Role) {}

    updateRole(role: Role) {}

    deleteRole(id: number) {}


    //Permission CRUD

    getPermissions() { }

    getPermissionById(id: number) { }

    addPermission(permission: Permission) { }

    updatePermission(permission: Permission) { }

    deletePermission(id: number) { }

}
