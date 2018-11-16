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
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MatDialog } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { AuthGuard } from "../../../guard/auth.guard";
import { SuppliersService } from '../suppliers/suppliers.service';
import { SelectionModel } from "@angular/cdk/collections";
import { GLOBAL } from "../../../shared/globel";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
  animations: fuseAnimations
})
export class ProductsComponent implements OnInit {
  dataSource;
  displayedColumns = [
    "select",
    "image",
    "name",
    "sku",
    "price",
    "inventory",
    "supplier",
    "classes",
    "status",
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
  suppliers;
  enableUpdateFieldCard = false;
  new_obj: any;
  bulkPrice = null;
  bulkInventory = null;
  options = '';
  id;
  classArray;

  selection = new SelectionModel<Element>(true, []);

  baseURL = GLOBAL.USER_IMAGE_API;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private productsService: ProductsService,
    private suppliersService: SuppliersService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    public cd: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.index();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
    var result = this.dataSource.data.filter(function (obj) {
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
    this.productsService.isProductActive({ active: event.checked }, p_id).subscribe(
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

  applyFilter(filterValue: string, event) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if (filterValue === '' && event.key === 'Enter') {
      return;
    }
    if (filterValue !== '') {
      if (event.key === 'Enter') {
        this.searchWord(filterValue);
      }
    } else {
      this.index();
    }
  }

  searchWord(search) {
    this.spinnerService.requestInProcess(true);
    this.productsService.searchbyWord(search).subscribe(
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

  pageChange(event) {
    this.getProductsWithPage(event.pageIndex + 1);
  }

  view(value) {
    if (value === 1) {
      this.totalItems = 0;
      this.index();
      this.optionSelection = false;
    } else {
      this.optionSelection = true;
    }
  }

  // getSuppliers() {
  //   this.spinnerService.requestInProcess(true);
  //   this.suppliersService.getSuppliers().subscribe(
  //     (res: any) => {
  //       this.suppliers = res.res.data.data;
  //       this.spinnerService.requestInProcess(false);
  //     },
  //     errors => {
  //       this.spinnerService.requestInProcess(false);
  //       const e = errors.error.message;
  //       this.snotifyService.error(e, "Error !");
  //     }
  //   );
  // }

  classSelected(class_name) {
    this.spinnerService.requestInProcess(true);
    this.productsService.getProductClassDetails(class_name).subscribe(
      (res: any) => {
        this.setDataSuorce(res.res.data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  deleteProduct() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.removeProduct();
      }
      this.confirmDialogRef = null;
    });
  }

  // removeProduct() {
  //   this.spinnerService.requestInProcess(true);
  //   this.productService.deleteProduct(+this.params.id).subscribe(
  //     (res: any) => {
  //       let e = res.res.message;
  //       this.snotifyService.success(e, "Success !");
  //       this.spinnerService.requestInProcess(false);
  //       this.router.navigate(["/products"]);
  //     },
  //     errors => {
  //       this.spinnerService.requestInProcess(false);
  //       let e = errors.message;
  //       this.snotifyService.error(e, "Error !");
  //     }
  //   );
  // }

  // converter(obj) {
  //   let temp = [];
  //   this.product.suppliers.pivot.class.forEach(c => {
  //     if (c === "slider") {
  //       c = 1;
  //     } else if (c === "featured") {
  //       c = 2;
  //     } else if (c === "on-sale") {
  //       c = 3;
  //     } else if (c === "new-arrival") {
  //       c = 4;
  //     } else if (c === "promoted") {
  //       c = 5;
  //     } else if (c === "add-on") {
  //       c = 6;
  //     } else if (c === "banner") {
  //       c = 7;
  //     } else if (c === "none") {
  //       c = 8;
  //     }
  //     temp.push(c);
  //   });
  //   this.product.suppliers.pivot.class = temp;
  //   console.log(obj);
  // }

  addClasses(value, i) {
    this.classArray = value;
    this.id = i;
    if (value === []) {
      this.classArray.push(8);
    }
  }

  update(flag) {
    if (flag === 1) {
      if ((this.bulkInventory === null) && (this.bulkPrice === null)) {
        this.snotifyService.warning('Please Fill atleast One Field');
        return;
      }
      let obj = [];
      const tempSelectedObj: any = this.selection.selected;
      for (const iterator of tempSelectedObj) {
        if (this.bulkInventory === null) {
          this.bulkInventory = iterator.suppliers[0].pivot.stock;
        }
        if (this.bulkPrice === null) {
          this.bulkPrice = iterator.suppliers[0].pivot.price;
        }
        obj.push({
          id: iterator.suppliers[0].pivot.id,
          price: this.bulkPrice,
          stock: this.bulkInventory
        });
      }
      this.options = 'bulkUploads/1?ps_bulk_update';
      this.updateBulkProducts(obj);
    } else {
      this.options = 'bulkUploads/' + this.id + '?ps_class_update';
      const obj = {
        id: this.id,
        class: this.classArray
      };
      this.updateBulkProducts(obj);
    }
  }

  updateBulkProducts(ps) {
    this.spinnerService.requestInProcess(true);
    this.productsService.updateBulkProduct(ps, this.options).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message);
        this.index();
        this.selection.clear();
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  imageView(original_image) {
    let spliting = original_image;
    spliting = spliting.split('/');
    if (spliting[0] === '') {
      return this.baseURL + original_image;
    } else {
      return original_image;
    }
  }
}
