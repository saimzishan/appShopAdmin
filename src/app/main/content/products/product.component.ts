import { Contact } from "./../apps/contacts/contact.model";
import {
  Supplier,
  OptionSet,
  OptionValue,
  ProductVariant,
  Options
} from "./../models/product.model";
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
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
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
import { TreeModel, Ng2TreeSettings } from "ng2-tree";
import { Router } from "@angular/router";
const treeSettings: Ng2TreeSettings = {
  rootIsVisible: false
};
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
  supplier: Supplier = new Supplier();
  product_variant: ProductVariant = new ProductVariant();
  options: Options = new Options();
  tOptions: Options[] = [];
  option_id = -1;
  option_set_id = [];
  rule_id = -1;
  disableRequired = false;
  isAddorEditSKU = false;

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

  enableOptionTable = false;

  files: UploadFile[] = [];
  nodes: any;

  suppliers: Supplier;
  brands;
  taxes;
  optionSets;
  optionsTab = true;
  skusTab = false;
  rulesTab = false;
  option_set: OptionSet = new OptionSet();
  option_value: OptionValue = new OptionValue();
  public tree: TreeModel;
  category_id: any;
  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private router: Router
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
      }
    );

    this.onCategoryChanged = this.productService.onCategoryChanged.subscribe(
      category => {
        // if (category)
        this.category = category;
        // this.tree.id = this.category.id;
        // this.tree.value = this.category.value;
        // let temp: TreeModel = {
        //   value: category[0].value,
        //   id: category[0].id
        // };
        //

        const temp = this.changeFieldName(category);

        this.tree = {
          value: "Categories",
          children: temp
        };
        // console.log(temp);
        // this.productForm = this.createProductForm();
      }
    );
  }

  // start

  addorEditSKU() {
    this.isAddorEditSKU = !this.isAddorEditSKU;
  }

  toogleChild(id) {
    let temp: any = document.getElementById("ulLi" + id);
    temp.hidden = !temp.hidden;
    // temp = temp[id].children;
    // for (let index = 1; index < temp.length; index++) {
    //   const element = temp[index];
    //   element.hidden = !element.hidden;
    // }
  }

  // end

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

  newOptionAdded() {
    // $('#addOptionModal').modal('show');
    this.newContact();
  }

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

  addProduct(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Fields");
      return;
    }
    this.product.suppliers.push(this.supplier);
    this.product.category_id = this.category_id;
    // this.product.suppliers[0].productVariants
    this.spinnerService.requestInProcess(true);

    this.productService.addProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.product = new Product();
        this.supplier = new Supplier();
        this.router.navigate(["/products"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
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
      }
    }
  }

  fileOver(event) {}

  fileLeave(event) {}
  checkMyOptions(val) {
    const result = this.optionSets.find(option => option.id === val);
    if (result !== undefined) {
      this.setDataSuorce(result.options);
      this.option_set.id = result.id;
      this.disableSkuAndRuleTab = true;
      this.enableOptionTable = true;
    } else {
      this.dataSource = [];
      this.disableSkuAndRuleTab = false;
      this.enableOptionTable = false;
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
  selectCategory(event, cId) {
    if (event.checked) {
      this.product.category_id = cId;
    }
  }
  handleSelection(event) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);
    }
  }
  setSelection(val) {
    this.option_id = val.selectedOptions.selected[0].value;
  }

  addAnotherSupplier() {
    this.product.suppliers.push(this.supplier);
    this.supplier = new Supplier();
    this.disableRequired = true;
    // document.getElementById("city").required() = false;
  }

  enableRequired() {
    this.disableRequired = false;
  }

  getOptionSetName(id) {
    const result = this.optionSets.find(option => option.id === id);
    if (result) {
      return result.name;
    }
  }
  getOptionName(id) {
    const res = this.optionSets.find(option => option.id === id);
    if (res) {
      // console.log(res);
      return res.options;
    }
  }

  // deleteOption(index) {
  //   this.product.option_values.splice(index, 1);
  //   if (this.product.option_values.length === 0) {
  //     this.disableSkuAndRuleTab = false;
  //   }
  //   console.log(this.product.option_values);
  // }

  changeFieldName(categories: Category[]) {
    const res: TreeModel[] = [];
    categories.forEach(category => {
      category.value = category.name;
      // delete element.name;
      const tempTree: TreeModel = {
        id: category.id,
        value: category.name,
        children: []
      };
      if (category.children.length > 0) {
        category.children.forEach(ele => {
          ele.value = ele.name;
          // delete ele.name;
          const tTree: TreeModel = {
            id: ele.id,
            value: ele.name
          };
          tempTree.children.push(tTree);
        });
      }
      res.push(tempTree);
    });
    return res;
  }
  handleSelected(event) {
    console.log(event);
    this.category_id = event.node.node.id;
  }

  ngOnDestroy() {
    this.onProductChanged.unsubscribe();
  }
}
