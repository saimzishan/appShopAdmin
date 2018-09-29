import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../shared/globel';
import { ApiService } from '../../../api/api.service';
import { AuthGuard } from '../../../guard/auth.guard';
import { Tag } from '../models/tag.model';

@Injectable()
export class TagsService extends ApiService {

  //Tag CRUD

  getTags() {
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
    return this.http.get(GLOBAL.USER_API + 'tags', httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  getTagById(id: number) {
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
    return this.http.get(GLOBAL.USER_API + 'tags/' + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  addTag(tag: Tag) {
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
    return this.http.post(GLOBAL.USER_API + 'tags', tag, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  updateTag(tag: Tag) {
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
    return this.http.put(GLOBAL.USER_API + 'tags/' + tag.id, tag, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }

  deleteTag(id: number) {
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
    return this.http.delete(GLOBAL.USER_API + 'tags/' + id, httpOptions)
      .map(this.extractData)
      .catch(err => {
        return this.handleError(err);
      });
  }
}
