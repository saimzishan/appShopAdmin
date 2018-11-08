import { Router } from "@angular/router";
import { SpinnerService } from "./../../../spinner/spinner.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { ProductsService } from "./products.service";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { AuthGuard } from "../../../guard/auth.guard";

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
    "active",
    "action"
  ];

  selectedOption = 1;
  option;
  optionSelection = false;

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
  addedSuppliers: any[];

  constructor(
    private productsService: ProductsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    public cd: ChangeDetectorRef,
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

  onSupplierChange(supplier_id, product, index) {
    this.supplier_id = supplier_id;
    this.product_id = product.id;
    let i = this.dataSource.data[index].suppliers.findIndex(s => s.id === supplier_id);
    let sp = this.dataSource.data[index].suppliers.splice(i, 1);
    this.dataSource.data[index].suppliers.push(sp[0]);
    this.dataSource.data[index].suppliers.reverse();
    this.cd.detectChanges();
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

  isActiveProduct(event, p_id) {
    this.productsService.isProductActive({active: event.checked}, p_id).subscribe(
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

  addNewSupplier(p_id) {
    let index = this.dataSource.data.findIndex(product => product.id === p_id);
    this.addedSuppliers = this.dataSource.data[index].suppliers;
    this.router.navigate(["/products/" + p_id], {
      queryParams: { addedSuppliers: btoa(JSON.stringify(this.addedSuppliers)), supplierId: this.supplier_id }
    });
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

  view(value) {
    if (value == 1) {
      this.option = "suppliers";
      this.optionSelection = false;
    } else {
      this.option = "class";
      this.optionSelection = true;
    }
  }
}
