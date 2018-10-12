import { Router } from "@angular/router";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ProductsService } from "./products.service";
import { DataSource } from "@angular/cdk/collections";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
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
    "brand",
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
  product_id: any;
  selectedSupplier: any;

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
          this.setDataSuorce(res.res.data.data);
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
  getSupplier(product_id) {
    var result = this.dataSource.data.filter(function(obj) {
      if (obj.id === product_id) {
        return obj;
      }
    })[0];
    this.selectedSupplier = result.suppliers[0];
    return result.suppliers;
  }
  onSupplierChange(supplier_id, product_id) {
    this.supplier_id = supplier_id;
    this.product_id = product_id;
  }
  editProduct(p_id) {
    if (!this.supplier_id) {
      let index = this.dataSource.data.findIndex(
        product => product.id === p_id
      );
      this.supplier_id = this.dataSource.data[index].suppliers[0].id;
    }
    this.router.navigate(["/products/" + p_id + "/" + this.supplier_id]);
  }
  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
  }
}
