import { GLOBAL } from "./../../../../shared/globel";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { Component, EventEmitter, Output } from "@angular/core";
import {
  Input,
  OnInit,
  ViewChildren,
  Directive,
  ViewChild
} from "@angular/core";
import {
  Supplier,
  Product,
  Image,
  BluckPrice
} from "../../models/product.model";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { CategoriesService } from "../../categories/categories.service";
import { ITreeOptions } from "angular-tree-component";
import { DetectChangesService } from "../../../../shared/detect-changes.services";
import { DropzoneDirective, DropzoneComponent } from "ngx-dropzone-wrapper";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-product-supplier-form",
  templateUrl: "./supplier.component.html"
})
export class SupplierFormComponent implements OnInit {
  product: Product;
  supplier: Supplier;
  images: Image[];
  lImages: any[] = [];
  image: Image;
  bluckPrices: BluckPrice[];
  taxes: any;
  brands: any;
  suppliers: Supplier;
  categories: any;
  categoryNodes: any[] = [];
  parentCat: any;
  category_id: number;
  product_id: number;
  deleteButton = false;
  categoryOption: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };
  @Output()
  productSaved = new EventEmitter();
  urltoMe = GLOBAL.USER_IMAGE_API;
  displayImage: any = false;
  bluckPrice: BluckPrice;
  url = "";
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  changesSubscription;
  pageType = "new";
  baseURL = GLOBAL.USER_IMAGE_API;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  ps_id: any;

  constructor(
    private productService: ProductService,
    public snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    protected http: HttpClient,
    private categoriesService: CategoriesService,
    private detectChanges: DetectChangesService,
    private dialog: MatDialog
  ) {
    this.product = new Product();
    this.supplier = new Supplier();
    this.bluckPrices = new Array<BluckPrice>();
    this.images = new Array<Image>();
    this.image = new Image();
    this.bluckPrice = new BluckPrice();
    this.changesSubscription = this.detectChanges.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }

  ngOnInit() {
    this.index();
    this.getSupplier();
    this.getTaxes();
    this.getBrands();
    if (this.pageType === "new") {
      this.init();
    }
  }
  callRelatedFunctions(res) {
    if (res.hasOwnProperty("option")) {
      switch (res.option) {
        case "editProduct":
          setTimeout(() => {
            this.pageType = "edit";
          }, 1);
          this.deleteButton = true;
          this.product = this.supplier = res.value;
          this.product_id = res.value.product_id;
          this.ps_id =  res.value.id;
          this.product.brand_id = res.value.brand.id;
          this.category_id = this.product.category_id =
            res.value.category[0].id;
          this.parentCat = res.value.category[0].name;
          this.supplier.buying_price = res.value.buyingPrice;
          this.supplier.market_price = res.value.marketPrice;
          this.supplier.id = res.value.supplier_id;
          this.supplier.low_level_stock = res.value.lowLevelStock;
          this.supplier.track_stock = res.value.trackStock;
          this.product.tax_id = res.value.tax.id;
          this.bluckPrices = res.value.bulk_prices;
          this.supplier.class = [];
          for (const iterator of res.value.product_classes) {
            let id = "";
            switch (iterator.class) {
              case "slider":
                id = "1";
                break;
              case "featured":
                id = "2";
                break;
              case "on-sale":
                id = "3";
                break;
              case "new-arrival":
                id = "4";
                break;
              case "promoted":
                id = "5";
                break;
              case "add-on":
                id = "6";
                break;

              default:
                break;
            }
            this.supplier.class.push(id);
          }
          break;
      }
    }
  }

  init() {
    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.product = current_product;
      this.supplier = current_product.supplier;
      this.displayImage = localStorage.getItem("current_product_sp_images");
      this.displayImage = JSON.parse(this.displayImage);
      this.displayImage = this.displayImage[0];
      this.onProductSaved(current_product);
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
    if (this.lImages.length < 1) {
      let a = this.directiveRef.dropzone();
      if (a.files.length === 0) {
        this.snotifyService.warning("Please Upload image", "Warning !");
        return;
      }
      for (const iterator of a.files) {
        this.addPicture(iterator);
      }
    }
    this.product.supplier = this.supplier;
    this.product.supplier.images = this.lImages;
    this.product.category_id = this.category_id;
    this.product.supplier.bulk_prices = this.bluckPrices;
    this.spinnerService.requestInProcess(true);
    this.product.supplier.ean = this.product.supplier.sku;
    this.productService.addProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.onProductSaved(this.product);
        this.product.id = res.res.data.id;
        delete this.product.supplier.images;
        let obj = res.res.data;
        obj.supplier = this.product.supplier;
        localStorage.setItem("current_product", JSON.stringify(obj));
        localStorage.setItem(
          "current_product_sp_images",
          JSON.stringify(res.res.data.images)
        );
        this.init();
        this.detectChanges.notifyOther({
          option: "addproduct",
          value: res.res.data
        });
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

  editSupplier(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    }

    setTimeout(() => {
      let a = this.directiveRef.dropzone();
      for (const iterator of a.files) {
        this.addPicture(iterator);
      }
    }, 1000);
    this.spinnerService.requestInProcess(true);
    delete this.supplier.images;
    let supplier = {
      id: this.supplier.id,
      ps_id: this.ps_id,
      track_stock: this.supplier.track_stock,
      printing_option: this.supplier.printing_option,
      active: this.supplier.active,
      class: this.supplier.class,
      stock: this.supplier.stock,
      low_level_stock: this.supplier.low_level_stock,
      buying_price: this.supplier.buying_price,
      market_price: this.supplier.market_price,
      price: this.supplier.price,
      sku: this.supplier.sku,
      ean: this.supplier.sku,
      upc: this.supplier.upc,
      width: this.supplier.width,
      weight: this.supplier.weight,
      height: this.supplier.height,
      depth: this.supplier.depth,
      images: this.lImages
    }
    
    this.putSupplier(supplier);
    
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.image.base64String = btoa(binaryString);
    let index = this.images.findIndex(image => image.type === this.image.type);
    if (index !== -1) {
      this.images[index].base64String = this.image.base64String;
      this.images[index].type = this.image.type;
      this.images[index].content_type = this.image.content_type;
    } else {
      this.images.push(new Image(this.image));
    }
    this.image = new Image();
    this.spinnerService.requestInProcess(false);
  }
  onUploadError(evt) {}
  onUploadSuccess(evt) {
    // this.image.base64String = evt[0].dataURL.split(",")[1];
    // this.image.content_type = evt[0].type.split("/")[1];
    // this.image.content_type = "." + this.image.content_type.split(";")[0];
    // this.image.type = "small";
    // //
    // for (let index = 0; index < 3; index++) {
    //   this.images.push(new Image(this.image));
    //   if (index === 0) {
    //     this.image.type = "medium";
    //   }
    //   if (index === 1) {
    //     this.image.type = "large";
    //   }
    // }
    // this.lImages.push(this.images);
    // this.images = new Array<Image>();
  }

  addPicture(obj) {
    this.image = new Image();
    this.image.base64String = obj.dataURL.split(",")[1];
    this.image.content_type = obj.type.split("/")[1];
    this.image.content_type = "." + this.image.content_type.split(";")[0];
    this.image.type = "small";
    //
    for (let index = 0; index < 3; index++) {
      this.images.push(new Image(this.image));
      if (index === 0) {
        this.image.type = "medium";
      }
      if (index === 1) {
        this.image.type = "large";
      }
    }
    this.lImages.push(this.images);
    this.images = new Array<Image>();
  }

  onCanceled(event) {
    console.log(event);
  }

  addBluckPrice(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    }
    this.bluckPrices.push(new BluckPrice(this.bluckPrice));
    form.form.reset();
    this.bluckPrice = new BluckPrice();
  }
  removeBluckPrice(index) {
    this.bluckPrices.splice(index, 1);
  }

  removeImage(image_id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.productService.deletePImage(+this.product.id, image_id).subscribe(
          res => {
            this.spinnerService.requestInProcess(false);
            if (!res.error) {
              this.snotifyService.success("Deleted successfully !", "Success");
              const result = this.supplier.images.findIndex(
                image => image.id === image_id
              );
              if (result !== -1) {
                this.supplier.images.splice(result, 1);
              }
            }
          },
          error => {
            this.spinnerService.requestInProcess(false);
            console.log(error);
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  removeBulkPrice(bulk_id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.productService.deletePBulkPrice(+this.product.id, bulk_id).subscribe(
          res => {
            this.spinnerService.requestInProcess(false);
            if (!res.error) {
              const result = this.bluckPrices.findIndex(
                bulk => bulk.id === bulk_id
              );
                this.bluckPrices.splice(result, 1);
                this.snotifyService.success("Deleted successfully !", "Success");
 
            } else {
              this.snotifyService.error('Something went wrong!' , "Error");
            }
          },
          error => {
            this.spinnerService.requestInProcess(false);
            console.log(error);
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  updateProduct() {
    if (!this.category_id) {
      this.snotifyService.warning("Please Select a category");
      return;
    }
    if (!this.product.name || this.product.name === "") {
      this.snotifyService.warning("Product name is required");
      return;
    }
    if (!this.product.brand_id) {
      this.snotifyService.warning("Please select brand id");
      return;
    }

    if (
      !this.product.long_description ||
      this.product.long_description === ""
    ) {
      this.snotifyService.warning("Long description name is required");
      return;
    }
    if (
      !this.product.short_description ||
      this.product.short_description === ""
    ) {
      this.snotifyService.warning("Short description is required");
      return;
    }

    if (!this.product.tax_id) {
      this.snotifyService.warning("Please select Tax");
      return;
    }

    let object = {
      id: this.product_id,
      category_id: this.category_id,
      name: this.product.name,
      brand_id: this.product.brand_id,
      long_description: this.product.long_description,
      short_description: this.product.short_description,
      tax_id: this.product.tax_id
    };

    this.put(object);
  }

  put(obj) {
    this.spinnerService.requestInProcess(true);
    this.productService.saveProduct(obj, "p_update").subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
        console.log(errors.error.message);
      }
    );
  }

  putSupplier(obj) {
    this.spinnerService.requestInProcess(true);
    this.productService.saveProduct(obj, "ps_update").subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
        console.log(errors.error.message);
      }
    );
  }
}
