import { GLOBAL } from "./../../../shared/globel";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs/Observable";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { FuseUtils } from "../../../core/fuseUtils";
import { BrandService } from "./brand.service";
import { BrandsService } from "./brands.service";
import { Brand } from "../models/brand.model";
// import { PeriodicElement } from '../user-management-admin/user-management/user-management.component';
import { SelectionModel } from "@angular/cdk/collections";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-brands",
  templateUrl: "./brands.component.html",
  styleUrls: ["./brands.component.scss"],
  animations: fuseAnimations
})
export class BrandsComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["name", "notes", "image"];
  selection = new SelectionModel<Brand>(true, []);
  brands;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private brandsService: BrandsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this.spinnerService.requestInProcess(true);
    this.brandsService.getBrands().subscribe(
      (res: any) => {
        let brands = res.res.data;
        this.setDataSuorce(brands);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        const e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSuorce(brands) {
    this.dataSource = new MatTableDataSource<Brand>(brands);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
