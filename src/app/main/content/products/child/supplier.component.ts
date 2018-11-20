import { GLOBAL } from "./../../../../shared/globel";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { MatSnackBar } from "@angular/material";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { Component, EventEmitter, Output } from "@angular/core";
import { Input, OnInit, ViewChild } from "@angular/core";
import { Supplier, Product, Image, BluckPrice } from "../../models/product.model";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { CategoriesService } from "../../categories/categories.service";
import { ITreeOptions } from "angular-tree-component";
import { DropzoneDirective, DropzoneComponent } from "ngx-dropzone-wrapper";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-product-supplier-form",
  templateUrl: "./supplier.component.html",
  styleUrls: ["./supplier.component.css"]
})
export class SupplierFormComponent implements OnInit {
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;
  @Input()
  product: Product;
  @Input()
  pageType: string;
  // supplier: Supplier;
  images: Image[];
  pTempImages: any[] = [];
  pImages: any[] = [];
  sTempImages: any[] = [];
  sImages: any[] = [];
  image: Image;
  bluckPrices: BluckPrice[];
  taxes: any;
  brands: any;
  suppliers: Supplier[] = [];
  categories: any;
  categoryNodes: any[] = [];
  parentCat: any;
  category_id: number;
  checkChild;
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
  baseURL = GLOBAL.USER_IMAGE_API;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  ps_id: any;
  params: any;
  addedSuppliers: any[];

  constructor(
    private productService: ProductService,
    public snackBar: MatSnackBar,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    protected http: HttpClient,
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.supplier = new Supplier();
    this.bluckPrices = new Array<BluckPrice>();
    this.images = new Array<Image>();
    this.image = new Image();
    this.bluckPrice = new BluckPrice();
    this.getAllCategories();
    this.getSupplier();
    this.getTaxes();
    this.getBrands();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
      if (this.params) {
        if (this.params.id !== "new") {
          this.product_id = params["id"] || "";
        }
      }
    });
    if (this.params.supplier_id) {
      this.makeArrayOfSides();
      this.converter();
      this.bulkPriceConvertor();
    }

    if (!this.params.supplier_id && this.pageType === 'edit') {
      this.route.queryParams.subscribe(params => {
        let addedSuppliers = params["addedSuppliers"];
        this.addedSuppliers = JSON.parse(atob(addedSuppliers));
      });
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
          if (!this.params.supplier_id && this.pageType === 'edit') {
            this.addedSuppliers.forEach(sp => {
              let index = this.suppliers.findIndex(s => s.id === sp.id);
              this.suppliers.splice(index, 1);
            });
          }
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors;
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

  getAllCategories() {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.getCategories().subscribe(
      (res: any) => {
        if (!res.status) {
          this.categories = res.res.data;
          this.categoryNodes = this.createNode(this.categories);
          if (this.pageType === "edit") {
            this.category_id = this.product.category.id;
            this.parentCat = this.product.category.name;
          }
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
  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    if (treeModel.activeNodes[0].data.hasChildren === true) {
      this.snotifyService.warning('Please Select Child Category');
      this.parentCat = '';
    } else {
      this.category_id = treeModel.activeNodes[0].data.my_id;
    }
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
    if (this.product.supplier.printing_option && this.product.supplier.sides.length === 0) {
      this.snotifyService.warning("Please select atleast one side for printing");
      return;
    }
    if (this.product.supplier.track_stock && this.product.supplier.stock === 0 &&
      this.product.supplier.low_level_stock === 0) {
      this.snotifyService.warning("You enter 0 in Low_Level_Stock or Stock");
      return;
    }
    if (this.product.supplier.track_stock === false) {
      this.product.supplier.low_level_stock = 0;
      this.product.supplier.stock = 0;
    }
    if (this.pTempImages.length === 0) {
      this.snotifyService.warning("Please upload Product image(s)", "Warning !");
      return;
    } else {
      this.pTempImages.forEach(img => {
        this.pImages.push(this.addPicture(img));
      });
    }
    if (this.sTempImages.length > 0) {
      this.sTempImages.forEach(img => {
        this.sImages.push(this.addPicture(img));
      });
    }

    this.product.product_images = this.pImages;
    this.product.supplier.images = this.sImages;
    this.product.category_id = this.category_id;
    this.spinnerService.requestInProcess(true);
    this.product.supplier.ean = this.product.supplier.sku;
    this.productService.addProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.onProductSaved(this.product);
        let temp = {
          _p_id: res.res.data.p_id,
          _s_id: this.product.supplier.id,
          _ps_id: res.res.data.id
        };
        localStorage.setItem("_saveP", JSON.stringify(temp));
        this.router.navigate(["/products/" + res.res.data.p_id + "/" + this.product.supplier.id]);
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

    if (this.sTempImages.length > 0) {
      this.sTempImages.forEach(img => {
        this.sImages.push(this.addPicture(img));
      });
    }

    setTimeout(() => {
      this.product.supplier.images = this.sImages;
      this.putSupplier(this.product.supplier);
    }, 1000);
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
  onUploadError(evt) { }
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

  addPicture(img) {
    let images = new Array<Image>();
    let image = new Image();
    image.base64String = img.dataURL.split(",")[1];
    image.content_type = img.type.split("/")[1];
    image.content_type = "." + image.content_type.split(";")[0];
    image.type = "small";
    //
    for (let index = 0; index < 3; index++) {
      images.push(new Image(image));
      if (index === 0) {
        image.type = "medium";
      }
      if (index === 1) {
        image.type = "large";
      }
    }
    return images;
  }

  onCanceled(event) {
  }

  addBluckPrice(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    }
    if (this.pageType === "edit" && this.params.supplier_id) {
      let obj: any = this.bluckPrice;
      obj.ps_id = this.product.id;
      obj.id = this.product.id;
      return this.addnewBulkPeice(obj);
    }
    this.product.supplier.bulk_prices.push(new BluckPrice(this.bluckPrice));
    form.form.reset();
    this.bluckPrice = new BluckPrice();
  }
  removeBluckPrice(index) {
    this.product.supplier.bulk_prices.splice(index, 1);
  }

  addnewBulkPeice(obj) {
    this.spinnerService.requestInProcess(true);
    this.productService.addBulkPrice(obj).subscribe(
      (res: any) => {
        this.product.supplier.bulk_prices = res.res.data;
        this.bluckPrice = new BluckPrice();
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
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
              this.directiveRef.reset();
              const result = this.product.product_images.findIndex(
                image => image.id === image_id
              );
              if (result !== -1) {
                this.product.product_images.splice(result, 1);
              }
            }
          },
          error => {
            this.spinnerService.requestInProcess(false);
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
        this.productService
          .deletePBulkPrice(+this.product.id, bulk_id)
          .subscribe(
            res => {
              this.spinnerService.requestInProcess(false);
              if (!res.error) {
                const result = this.product.supplier.bulk_prices.findIndex(
                  bulk => bulk.id === bulk_id
                );
                this.product.supplier.bulk_prices.splice(result, 1);
                this.snotifyService.success(
                  "Deleted successfully !",
                  "Success"
                );
              } else {
                this.snotifyService.error("Something went wrong!", "Error");
              }
            },
            error => {
              this.spinnerService.requestInProcess(false);
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

    if (this.pTempImages.length === 0 && this.product.product_images.length === 0) {
      this.snotifyService.warning("Please upload Product image(s)", "Warning !");
      return;
    } else {
      this.pTempImages.forEach(img => {
        this.pImages.push(this.addPicture(img));
      });
    }


    let object = {
      id: this.product_id,
      product_images: this.pImages,
      category_id: this.category_id,
      active: this.product.active,
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
        this.product.product_images = res.res.data;
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  putSupplier(updatedSupplier) {
    updatedSupplier.id = this.product.id;
    if (updatedSupplier.track_stock === false) {
      updatedSupplier.low_level_stock = 0;
      updatedSupplier.stock = 0;
    }
    if (this.product.supplier.printing_option && this.product.supplier.sides.length === 0) {
      this.snotifyService.warning("Please select atleast one side for printing");
      return;
    }
    if (this.product.supplier.track_stock && +this.product.supplier.stock === 0 &&
      +this.product.supplier.low_level_stock === 0) {
      this.snotifyService.warning("You enter 0 in Low_Level_Stock or Stock");
      return;
    }
    this.spinnerService.requestInProcess(true);
    this.productService.saveProduct(updatedSupplier, "ps_update").subscribe(
      (res: any) => {
        this.product.supplier.images = res.res.data;
        this.directiveRef.reset();
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  editBulkPrice(id, from, to, discount, changed_by) {
    const obj = {
      bulck_p_id: id,
      from: from,
      to: to,
      discount: discount,
      changed_by: changed_by
    };
    this.spinnerService.requestInProcess(true);
    this.productService.saveProduct(obj, "p_bulck_price").subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        this.snotifyService.success(res.res.message + "Success !");
      },
      (errors: any) => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  addNewSupplierToProduct(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    }

    if (!this.category_id) {
      this.snotifyService.warning("Please Select a category");
      return;
    }
    if (this.product.supplier.printing_option && this.product.supplier.sides.length === 0) {
      this.snotifyService.warning("Please select atleast one side for printing");
      return;
    }
    if (this.product.supplier.track_stock && this.product.supplier.stock === 0 &&
      this.product.supplier.low_level_stock === 0) {
      this.snotifyService.warning("You enter 0 in Low_Level_Stock or Stock");
      return;
    }
    if (this.product.supplier.track_stock === false) {
      this.product.supplier.low_level_stock = 0;
      this.product.supplier.stock = 0;
    }
    if (this.sTempImages.length > 0) {
      this.sTempImages.forEach(img => {
        this.sImages.push(this.addPicture(img));
      });
    }
    this.product.product_images = this.pImages;
    this.product.supplier.images = this.sImages;
    this.product.category_id = this.category_id;
    this.spinnerService.requestInProcess(true);
    this.product.supplier.ean = this.product.supplier.sku;
    this.productService.addNewSupplierToProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.onProductSaved(this.product);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );

  }

  addBulkPricetoServer() { }

  converter() {
    let temp = [];
    this.product.supplier.class.forEach(c => {
      if (c === "slider") {
        c = 1;
      } else if (c === "featured") {
        c = 2;
      } else if (c === "on-sale") {
        c = 3;
      } else if (c === "new-arrival") {
        c = 4;
      } else if (c === "promoted") {
        c = 5;
      } else if (c === "add-on") {
        c = 6;
      } else if (c === "banner") {
        c = 7;
      } else if (c === "none") {
        c = 8;
      } else if (c === "hot") {
        c = 9;
      }
      temp.push(c);
    });
    this.product.supplier.class = temp;
  }

  bulkPriceConvertor() {
    this.product.supplier.bulk_prices.forEach(c => {
      if (c.changed_by === "absolute") {
        c.changed_by = 1;
      } else if (c.changed_by === "percentage") {
        c.changed_by = 2;
      }
    });
  }

  makeArrayOfSides() {
    if (this.pageType === 'edit' && this.product.supplier.sides !== null) {
      this.product.supplier.sides = this.product.supplier.sides.split(',');
    }
  }

  getSupplierName(supplierId) {
    let supplier = this.suppliers.find(s => s.id === supplierId);
    if (supplier) {
      return supplier.name;
    } else {
      return 'supplier';
    }
  }

  onProductSuccess(event) {
    this.pTempImages.push(event[0]);
  }

  onProductRemove(event) {
    let index = this.pTempImages.findIndex(img => img.upload.uuid === event.upload.uuid);
    if (index !== -1) {
      this.pTempImages.splice(index, 1);
    }
  }

  onSupplierSuccess(event) {
    this.sTempImages.push(event[0]);
  }

  onSupplierRemove(event) {
    let index = this.sTempImages.findIndex(img => img.upload.uuid === event.upload.uuid);
    if (index !== -1) {
      this.sTempImages.splice(index, 1);
    }
  }

  imageView(original_image) {
    let spliting = original_image;
    if (
      original_image !== undefined &&
      original_image !== null &&
      original_image !== ""
    ) {
      spliting = spliting.split("/");
      if (spliting[0] === "") {
        return this.baseURL + original_image;
      } else {
        return original_image;
      }
    }
  }
}
