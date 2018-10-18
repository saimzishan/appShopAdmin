import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../../../shared/globel';
import { AuthGuard } from '../../../guard/auth.guard';
import { ApiService } from '../../../api/api.service';

@Injectable()
export class BrandService extends ApiService {
    
    getBrandById(id: number) {
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
            .get(GLOBAL.USER_API + "brands/" + id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    addBrand(brand) {
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
            .post(GLOBAL.USER_API + "brands", brand, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    updateBrand(brand) {
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
            .put(GLOBAL.USER_API + "brands/" + brand.id, brand, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }

    deleteBrand(brand_id) {
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
            .delete(GLOBAL.USER_API + "brands/" + brand_id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.extractData(err);
            });
    }

    deleteBrandImage(brand_id: number, image_id: number) {
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
            .delete(GLOBAL.USER_API +"brands/" +brand_id +"?b_image_delete&b_image_id=" +image_id, httpOptions)
            .map(this.extractData)
            .catch(err => {
                return this.handleError(err);
            });
    }
}
