import { filter } from "rxjs/operators";
import { Router } from "@angular/router";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ProductsService } from "./products.service";
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
import { SnotifyService } from "ng-snotify";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
  animations: fuseAnimations
})
export class ProductsComponent implements OnInit {
  dataSource;
  displayedColumns = [
    "id",
    "image",
    "name",
    "category",
    "price",
    "quantity",
    "supplier",
    "active"
  ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  supplier_id: any;

  constructor(
    private productsService: ProductsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.index();
  }

  index() {
    this.spinnerService.requestInProcess(true);
    this.productsService.getProducts().subscribe(
      (res: any) => {
        if (!res.status) {
          this.setDataSuorce(res.res.data);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
        // this.notificationServiceBus.launchNotification(true, e);
      }
    );
  }
  getSupplier(id) {
    var result = this.dataSource.data.filter(function(obj) {
      if (obj.id === id) {
        return obj;
      }
    })[0];
    return result.suppliers;
  }
  onSupplierChange(value) {
    this.supplier_id = value;
  }
  eidt(id, supplier_id) {
    console.log(supplier_id);
    this.router.navigate(["/products/" + id + "/" + supplier_id]);
  }
  rowClick(obj) {
    console.log(obj);
  }

  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
    // console.log(this.dataSource);
  }
}
