import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Product, Supplier } from "./../models/product.model";
import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatDialog, MatDialogRef } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { SpinnerService } from "../../../spinner/spinner.service";
import { ProductService } from "./product.service";
import { SnotifyService } from "ng-snotify";
import { VariantComponent } from "./variant/variant.component";

declare var $: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProductComponent implements OnInit, OnDestroy {
  bluckPrice: BluckPrice = new BluckPrice();
  bluckPrices: BluckPrice[];
  @ViewChild(VariantComponent) variantInstance: VariantComponent ; 

  ps_panelOpenState = true;
  ps_sku_panelOpenState = false;
  ps_v_panelOpenState = false;

  viewChildren = false;
  pageType: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  isOpen: boolean = false;

  checkParams = "";

  product_id: any;
  productName = "";
  supplier_id: any = false;
  enabledChild: boolean = true;
  product: Product;
  params: any;
  supplierId: number;
  constructor(
    private dialog: MatDialog,
    protected http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private productService: ProductService,
    private snotifyService: SnotifyService
  ) {
    this.bluckPrices = new Array<BluckPrice>();
  }

  ngOnInit() {
    // Subscribe to update product on changes
    this.route.params.subscribe(params => {
      this.params = params;
      if (this.params) {
        if (this.params.id === "new") {
          this.pageType = "new";
          this.product = new Product();
        } else {
          this.edit(this.params);
          this.pageType = "edit";
          this.enabledChild = false;
        }
      }
    });

    let isAlreadySaved: any = localStorage.getItem("_saveP");
    if (isAlreadySaved) {
      isAlreadySaved = JSON.parse(isAlreadySaved);
      localStorage.removeItem("_saveP");
      this.router.navigate([
        "/products/" + isAlreadySaved._p_id + "/" + isAlreadySaved._s_id
      ]);
    }

    if (!this.params.supplier_id && this.pageType === 'edit') {
      this.route.queryParams.subscribe(params => {
        let s_id = params["supplierId"];
          if (s_id) {
            this.supplierId = +s_id;
          }
      });
    }
  }

  edit(params) {
    this.spinnerService.requestInProcess(true);
    if(params.supplier_id) {
      this.productService.getProductWithSupplier(params.id, params.supplier_id)
      .subscribe((res: any) => {
        if (!res.status) {
          this.product = new Product(res.res.data);
          this.onProductSaved(params); // for edit or after add product
        }
        this.spinnerService.requestInProcess(false);
      },
        errors => {
          this.spinnerService.requestInProcess(false);
          let e = errors;
          e = JSON.stringify(e.error);
          this.snotifyService.error(e, "Error !");
        });
    } else { // when want to add new supplier
      this.productService.getProductWithId(params.id)
      .subscribe((res: any) => {
        if (!res.status) {
          let foundSupplier: any;
          this.product = new Product(res.res.data);
          if (res.res.data) {
            foundSupplier = (this.supplierId) ? res.res.data.suppliers.find(s => s.id === this.supplierId) :
            res.res.data.suppliers[0];
            this.bindSupplier(foundSupplier);
          }
        }
        this.spinnerService.requestInProcess(false);
      },
        errors => {
          this.spinnerService.requestInProcess(false);
          let e = errors;
          e = JSON.stringify(e.error);
          this.snotifyService.error(e, "Error !");
        });
    }
  }


  bindSupplier(supplier: any) {
    this.product.supplier = new Supplier();
    if(supplier) {
      this.product.supplier.buying_price = supplier.buying_price;
      this.product.supplier.market_price = supplier.market_price;
      this.product.supplier.price = supplier.price;
      this.product.supplier.upc = supplier.upc;
      this.product.supplier.width = supplier.width;
      this.product.supplier.weight = supplier.weight;
      this.product.supplier.height = supplier.height;
      this.product.supplier.depth = supplier.depth;
    }
  }

  onProductSaved(evt) {
    this.product_id = evt.id;
    this.supplier_id = evt.supplier_id;
    this.enabledChild = false;
  }

  enableChildren() {
    this.viewChildren = true;
  }

  disableChildren() {
    this.viewChildren = false;
  }

  deleteProduct() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeProduct();
      }
      this.confirmDialogRef = null;
    });
  }

  removeProduct() {
    this.spinnerService.requestInProcess(true);
    this.productService.deleteProduct([+this.params.id]).subscribe(
      (res: any) => {
        let e = res.res.message;
        this.snotifyService.success(e, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/products"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }
  
  saveAndExit() {
    localStorage.removeItem("current_product");
    localStorage.removeItem("current_product_sp_images");
    localStorage.removeItem("optionSet");
    this.router.navigate(["/products"]);
  }

  // scrollToId() {
  //   $("#middleOfPanel")[0].scrollIntoView();
  // }

  ngOnDestroy() {}

  getOptionSet() {
    this.variantInstance.setProductSupplierIds();
    this.variantInstance.getProductOptionSetWithValue();
  }
}

export class BluckPrice {
  from: number;
  to: number;
  discount: number;
  changed_by: number;
  product_supplier_id: number;
  constructor(bluckPrice?) {
    bluckPrice = bluckPrice || {};
    this.from = bluckPrice.from;
    this.to = bluckPrice.to;
    this.discount = bluckPrice.discount;
    this.changed_by = bluckPrice.changed_by;
    this.product_supplier_id = bluckPrice.product_supplier_id;
  }
}
