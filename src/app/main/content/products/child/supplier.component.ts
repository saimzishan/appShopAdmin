import { GLOBAL } from "./../../../../shared/globel";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { SnotifyService } from "ng-snotify";
import { MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { Component, EventEmitter, Output } from "@angular/core";
import { Input, OnInit, ViewChildren, Directive } from "@angular/core";
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
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  UploadEvent,
  UploadFile
} from "ngx-file-drop";

@Component({
  selector: "app-product-supplier-form",
  templateUrl: "./supplier.component.html"
})
export class SupplierFormComponent implements OnInit {
  product: Product;
  supplier: Supplier;
  images: Image[];
  image: Image;
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
  files: UploadFile[] = [];
  urltoMe = GLOBAL.USER_IMAGE_API;
  displayImage: any = false;
  bluckPrice: BluckPrice;
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
    this.images = new Array<Image>();
    this.image = new Image();
    this.bluckPrice = new BluckPrice();
  }

  ngOnInit() {
    this.index();
    this.getSupplier();
    this.getTaxes();
    this.getBrands();
    this.init();
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
    if (this.images.length < 2) {
      this.snotifyService.warning(
        "Please Upload three images (small, medium, large)",
        "Warning"
      );
      return;
    }
    this.product.supplier = this.supplier;
    this.product.supplier.images = this.images;
    this.product.category_id = this.category_id;
    this.product.supplier.bulk_prices = this.bluckPrices;
    this.spinnerService.requestInProcess(true);

    this.productService.addProduct(this.product).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.onProductSaved(this.product);
        this.product.id = res.res.data.id;
        localStorage.setItem("current_product", JSON.stringify(this.product));
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

  dropped(event: UploadEvent, type: string) {
    this.spinnerService.requestInProcess(true);
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          this.image.content_type = "." + file.type.split("/")[1];
          this.image.type = type;
          const reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);

          reader.readAsBinaryString(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
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
}
