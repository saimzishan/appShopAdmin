import { Subscription } from "rxjs/Subscription";
import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ProductService } from "./product.service";
import { fuseAnimations } from "../../../core/animations";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { Product } from "../models/product.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FuseUtils } from "../../../core/fuseUtils";
import { MatSnackBar, MatDialog, MatDialogRef } from "@angular/material";
import { Location } from "@angular/common";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from "ngx-file-drop";
// import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { Category } from "../models/category.model";
import { TreeModule } from "ng2-tree";
import { MatTableDataSource } from "@angular/material";
import { NgSelectMultipleOption } from "@angular/forms/src/directives";
import { FuseOptionFormDialogComponent } from "./sku-form/option-form.component";
// import * as $ from 'jquery';
declare var $: any;
// import {MatTreeModule} from '@angular/material/tree';

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProductComponent implements OnInit, OnDestroy {
  product = new Product();
  onProductChanged: Subscription;
  category = new Category();
  onCategoryChanged: Subscription;
  viewChildren = false;
  pageType: string;
  productForm: FormGroup;
  dataSource;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  disableSkuAndRuleTab = false;
  dialogRef: any;

  files: UploadFile[] = [];
  nodes: any;
  // nodes = [
  //   {
  //     id: 1,
  //     name: 'cat 1',
  //     children: [
  //       { id: 2, name: 'cat 1-1' },
  //       { id: 3, name: 'cat 1-2' }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'cat 2',
  //     children: [
  //       { id: 5, name: 'cat 2-1' },
  //       {
  //         id: 6,
  //         name: 'cat 2-2',
  //         children: [
  //           { id: 7, name: 'cat 2-2-1' }
  //         ]
  //       }
  //     ]
  //   }
  // ];
  options = {};
  suppliers: any;
  brands;
  taxes;
  optionSets;
  optionsTab = true;
  skusTab = false;
  rulesTab = false;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Subscribe to update product on changes
    this.getSupplier();
    // this.getTaxes();
    this.getBrands();
    this.getOptionSets();

    this.onProductChanged = this.productService.onProductChanged.subscribe(
      product => {
        if (product) {
          this.product = new Product(product);
          this.pageType = "edit";
        } else {
          this.pageType = "new";
          this.product = new Product();
        }

        this.productForm = this.createProductForm();
      }
    );

    this.onCategoryChanged = this.productService.onCategoryChanged.subscribe(
      category => {
        // if (category)
        this.category = category;
        // this.productForm = this.createProductForm();
      }
    );
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
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.productService.deleteProduct(data).then(() => {
          this.productService.onProductChanged.next(data);
        });
      }
      this.confirmDialogRef = null;
    });
  }

  createProductForm() {
    return this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name],
      handle: [this.product.handle],
      short_description: [this.product.short_description],
      long_description: [this.product.long_description],
      categories: [this.product.categories],
      category_id: [this.product.category_id],
      tax_id: [this.product.tax_id],
      brand_id: [this.product.brand_id],
      supplier_id: [this.product.supplier_ids.id],
      price: [this.product.supplier_ids.price],
      // taxRate: [this.product.taxRate],
      // comparedPrice: [this.product.comparedPrice],
      // quantity: [this.product.quantity],
      sku: [this.product.supplier_ids.sku],
      width: [this.product.supplier_ids.width],
      height: [this.product.supplier_ids.height],
      depth: [this.product.supplier_ids.depth],
      weight: [this.product.supplier_ids.weight],
      upc: [this.product.supplier_ids.upc],
      ean: [this.product.supplier_ids.ean]
      // extraShippingFee: [this.product.extraShippingFee],
      // active: [this.product.active],
    });
  }

  newOptionAdded() {
    // $('#addOptionModal').modal('show');
    this.newContact();
  }

  // createCategoryForm() {
  //   return this.formBuilder.group({
  //     id: [this.category.id],
  //     name: [this.category.name],
  //     handle: [this.product.handle],
  //     description: [this.product.description],
  //     categories: [this.product.categories],
  //     tags: [this.product.tags],
  //     images: [this.product.images],
  //     priceTaxExcl: [this.product.priceTaxExcl],
  //     priceTaxIncl: [this.product.priceTaxIncl],
  //     price: [this.product.price],
  //     taxRate: [this.product.taxRate],
  //     comparedPrice: [this.product.comparedPrice],
  //     quantity: [this.product.quantity],
  //     sku: [this.product.sku],
  //     width: [this.product.width],
  //     height: [this.product.height],
  //     depth: [this.product.depth],
  //     weight: [this.product.weight],
  //     extraShippingFee: [this.product.extraShippingFee],
  //     active: [this.product.active]
  //   });
  // }

  saveProduct() {
    this.spinnerService.requestInProcess(true);

    const data = this.productForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.productService.saveProduct(data).then(() => {
      // Trigger the subscription with new data
      this.productService.onProductChanged.next(data);

      // Show the success message
      this.snotifyService.success("Product added", "Success !");
      // Change the location with new one
      this.spinnerService.requestInProcess(false);

      this.location.go("/products");
    });
  }

  addProduct() {
    this.spinnerService.requestInProcess(true);
    const data = this.productForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.productService.addProduct(data).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.snotifyService.success("Product added", "Success !");
          // this.router.navigate(['/user-management']);
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
  // .then(() => {

  //   // Trigger the subscription with new data
  //   this.productService.onProductChanged.next(data);

  //   // Show the success message
  //   // this.snackBar.open('Product added', 'OK', {
  //   //   verticalPosition: 'top',
  //   //   duration: 2000
  //   // });

  //   this.snotifyService.success('Product added','Success !');
  //   this.spinnerService.requestInProcess(false);
  //   // Change the location with new one
  //   this.location.go('/products');
  //   // Change the location with new one
  //   // this.location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
  // });
  // }

  getSupplier() {
    this.spinnerService.requestInProcess(true);
    this.productService.getSupplier().subscribe(
      (res: any) => {
        if (!res.status) {
          this.suppliers = res.res.data;
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
  getOptionSets() {
    this.spinnerService.requestInProcess(true);
    this.productService.getOptionSets().subscribe(
      (res: any) => {
        if (!res.status) {
          this.optionSets = res.res.data;
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

  dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
            // Sanitized logo returned from backend
          })
           **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fileOver(event) {
    console.log(event);
  }

  fileLeave(event) {
    console.log(event);
  }
  checkMyOptions(val) {
    const result = this.optionSets.find(option => option.id === val);
    if (result !== undefined) {
      this.setDataSuorce(result.options);
      this.disableSkuAndRuleTab = true;
    } else {
      this.dataSource = [];
      this.disableSkuAndRuleTab = false;
    }
  }

  newContact() {
    this.dialogRef = this.dialog.open(FuseOptionFormDialogComponent, {
      panelClass: "contact-form-dialog",
      data: {
        action: "new"
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
    });
  }

  setDataSuorce(obj) {
    this.dataSource = obj;
  }
  openRelatedTab(val: string) {
    switch (val) {
      case "rulesTab":
        this.rulesTab = true;
        this.optionsTab = false;
        this.skusTab = false;
        break;
      case "skusTab":
        this.rulesTab = false;
        this.optionsTab = false;
        this.skusTab = true;
        break;
      default:
        this.rulesTab = false;
        this.optionsTab = true;
        this.skusTab = false;
    }
  }

  ngOnDestroy() {
    this.onProductChanged.unsubscribe();
  }
}
