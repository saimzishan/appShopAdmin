import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { Component, EventEmitter, Output } from "@angular/core";
import { Input, OnInit, ViewChildren, Directive } from "@angular/core";
import { Supplier, Product } from "../../models/product.model";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { CategoriesService } from "../../categories/categories.service";
import { GLOBAL } from "../../../../shared/globel";
import { ITreeOptions } from "angular-tree-component";
import { DetectChangesService } from "../../../../shared/detect-changes.services";
@Component({
  selector: "app-product-supplier-form",
  templateUrl: "./supplier.component.html"
})
export class SupplierFormComponent implements OnInit {
  product: Product;
  supplier: Supplier;
  bluckPrices: BluckPrice[];
  taxes: any;
  brands: any;
  suppliers: Supplier;
  categories: any;
  categoryNodes: any[] = [];
  parentCat: any;
  category_id: number;
  categoryOption: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };
  @Output()
  productSaved = new EventEmitter();

  constructor(
    private productService: ProductService,
    public snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    protected http: HttpClient,
    private categoriesService: CategoriesService,
    private detectChanges: DetectChangesService
  ) {
    this.product = new Product();
    this.supplier = new Supplier();
    this.bluckPrices = new Array<BluckPrice>();
  }

  ngOnInit() {
    this.getSupplier();
    this.getTaxes();
    this.getBrands();
    this.index();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      // this.supplier.upc.
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  validateForm(form) {
    this.validateAllFormFields(form.control);
    this.snotifyService.warning("Please Fill All Required Fields");
  }

  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      this.spinnerService.requestInProcess(true);
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      };
      this.http
        .get(GLOBAL.USER_API + "categories/" + node.data.my_id, httpOptions)
        .subscribe((response: any) => {
          if (!response.error) {
            resolve(this.createNode(response.data));
          } else {
            this.snotifyService.error(response.error);
          }
          this.spinnerService.requestInProcess(false);
        }, reject);
    });
  }

  getSupplier() {
    this.spinnerService.requestInProcess(true);
    this.productService.getSupplier().subscribe(
      (res: any) => {
        if (!res.status) {
          this.suppliers = res.res.data.data;
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

  getTaxes() {
    this.spinnerService.requestInProcess(true);
    this.productService.getTaxes().subscribe(
      (res: any) => {
        if (!res.status) {
          this.taxes = res.res.data;
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
  getBrands() {
    this.spinnerService.requestInProcess(true);
    this.productService.getBrands().subscribe(
      (res: any) => {
        if (!res.status) {
          this.brands = res.res.data;
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

  createNode(obj) {
    let tempNode = [];
    obj.forEach(row => {
      let tempObj = {};
      if (row.children.length > 0) {
        tempObj = {
          name: row.name,
          hasChildren: true,
          my_id: row.id
        };
      } else {
        tempObj = { name: row.name, my_id: row.id };
      }

      tempNode.push(tempObj);
    });
    return tempNode;
  }

  index() {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.index().subscribe(
      (res: any) => {
        if (!res.status) {
          this.categories = res.res.data;
          this.categoryNodes = this.createNode(this.categories);
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
  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    this.category_id = treeModel.activeNodes[0].data.my_id;
  }
  onProductSaved(obj) {
    obj.supplier_id = this.product.supplier.id;
    this.productSaved.emit(obj);
  }

  addProduct(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    }

    if (!this.category_id) {
      this.snotifyService.warning("Please Select a category");
      return;
    }
    this.product.supplier = this.supplier;
    this.product.category_id = this.category_id;
    this.spinnerService.requestInProcess(true);

    this.productService.addProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.onProductSaved(res.res.data);
        localStorage.setItem('current_product' , JSON.stringify(this.product));
        this.detectChanges.notifyOther({"product": this.product});
        // this.router.navigate(["/products"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }
}

export class BluckPrice {
  from: number;
  to: number;
  discount: number;
  changeBy: number;
  product_supplier_id: number;
  constructor(bluckPrice?) {
    bluckPrice = bluckPrice || {};
    this.from = bluckPrice.from;
    this.to = bluckPrice.to;
    this.discount = bluckPrice.discount;
    this.changeBy = bluckPrice.changeBy;
    this.product_supplier_id = bluckPrice.product_supplier_id;
  }
}
