import { Router } from "@angular/router";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ProductsService } from "./products.service";
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
  totalItems: number;
  perPage: number;

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
          this.totalItems = res.res.data.total;
          this.perPage = res.res.data.per_page;
          this.setDataSuorce(res.res.data.data);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  getProductsWithPage(page: number) {
    this.spinnerService.requestInProcess(true);
    this.productsService.getProductsWithPage(page).subscribe(
      (res: any) => {
        if (!res.status) {
          this.totalItems = res.res.data.total;
          this.perPage = res.res.data.per_page;
          this.setNewPageDataSuorce(res.res.data.data);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      });
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
    this.dataSource.sort = this.sort;
  }

  setNewPageDataSuorce(products) {
    this.dataSource = new MatTableDataSource<any>(products);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChange(event) {
    this.getProductsWithPage(event.pageIndex + 1);
  }
}
