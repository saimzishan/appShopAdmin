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
import { User } from '../models/user.model';

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

    getRoleById(id: number) {
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
        return this.http.get(GLOBAL.USER_API + 'roles/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    addRole(role: Role) {
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
        return this.http.post(GLOBAL.USER_API + 'roles', role, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    updateRole(role: Role) {
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
        return this.http.put(GLOBAL.USER_API + 'roles/' + role.id, role, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deleteRole(id: number) {
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
        return this.http.delete(GLOBAL.USER_API + 'roles/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }


    //Permission CRUD

    getPermissions() {
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
        return this.http.get(GLOBAL.USER_API + 'permissions', httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    getPermissionById(id: number) {
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
        return this.http.get(GLOBAL.USER_API + 'permissions/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    addPermission(permission: Permission) {
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
        return this.http.post(GLOBAL.USER_API + 'permissions', permission, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    updatePermission(permission: Permission) {
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
        return this.http.put(GLOBAL.USER_API + 'permissions/' + permission.id, permission, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deletePermission(id: number) {
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
        return this.http.delete(GLOBAL.USER_API + 'permissions/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    //User CRUD

    getUsers(option) {
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
        return this.http.get(GLOBAL.USER_API + 'users' + option , httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    getUserById(id: number) {
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
        return this.http.get(GLOBAL.USER_API + 'users/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    addUser(user: User) {
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
        return this.http.post(GLOBAL.USER_API + 'users', user, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    updateUser(user: User ) { }

    updateUserRoles(user: User) {
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
        return this.http.put(GLOBAL.USER_API + 'users/' + user.id + '?u_level=' + user.level, user, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deleteUser(id: number) {
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
        return this.http.delete(GLOBAL.USER_API + 'users/' + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }
}
