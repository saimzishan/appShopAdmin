import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ProductsService } from './products.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
// import { fuseAnimations } from '../../../core/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
// import { FuseUtils } from '../../../core/fuseUtils';

@Component({
    selector   : 'app-product-managment',
    templateUrl: './product-management.component.html',
    styleUrls  : ['./product-management.component.css']
    // animations : fuseAnimations
})
export class ProductManagmentComponent implements OnInit {
    ngOnInit(): void {
    }

}
