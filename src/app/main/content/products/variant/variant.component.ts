import { GLOBAL } from "./../../../../shared/globel";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { ProductVariant, Image } from "../../models/product.model";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-variant-form",
  templateUrl: "./variant.component.html"
})
export class VariantComponent implements OnInit {
  option_set_id = [];
  optionSets: any;
  optionSetWithValue: {};
  @Input()
  product_id;
  @Input()
  supplier_id;
  @Input()
  option_with_value: OptionSet[] = new Array<OptionSet>();
  product_variant: ProductVariant;
  baseURL = GLOBAL.USER_IMAGE_API;
  isAddorEditSKU = false;
  productVariant: ProductVariant[] = new Array<ProductVariant>();
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  variants: ProductVariant[] = new Array<ProductVariant>();
  changesSubscription;
  option_skus;
  enableOptions = false;
  obj = [];
  supplierId = -1;
  productId = -1;
  images: Image[];
  image: Image;
  lImages: any = [];
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  pageType: string;
  productID: number;
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private router: Router,
    private detectChangesService: DetectChangesService
  ) {
    this.images = new Array<Image>();
    this.image = new Image();
    this.pageType = "new";
    this.product_variant = new ProductVariant();
    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }

  ngOnInit() {
    this.init();
  }
  init() {
    let optionSet: any = localStorage.getItem("optionSet");
    if (optionSet) {
      optionSet = JSON.parse(optionSet);
      this.setOptions(optionSet);
    }

    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.product_variant = current_product.supplier;
      this.supplierId = current_product.supplier.id;
      this.productId = current_product.id;
    }
  }
  callRelatedFunctions(res) {
    if (res.hasOwnProperty("option")) {
      switch (res.option) {
        case "optionsAdded":
          this.init();
          break;
        case "editProduct":
          this.productID = res.value.product_id;
          this.edit(res.value.product_variants);
          break;
      }
    }
  }

  edit(variantsObj) {
    this.pageType = "edit";
    this.variants = variantsObj;
    this.variants.forEach(variant => {
      if (variant.operation === 'none') {
        variant.operation = 1;
      } else if (variant.operation === 'add') {
        variant.operation = 2;
      } else if (variant.operation === 'subtract') {
        variant.operation = 3;
      }
      if (variant.changeBy === 'absolute') {
        variant.changeBy = 1;
      } else if (variant.changeBy === 'percentage') {
        variant.changeBy = 2;
      }
    });
    this.isAddorEditSKU = true;
  }
  editSku(variant) {
    this.product_variant = variant;
  }
  setOptions(obj) {
    this.option_with_value = obj;
  }
  getOption(id) {
    const res = this.option_with_value.find(
      option => option.option_set_id === id
    );
    if (res) {
      return res.options;
    }
  }

  addOrEditSku() {
    this.isAddorEditSKU = !this.isAddorEditSKU;
  }

  seletOption(id) {
    this.option_skus = this.getOption(id);
    this.enableOptions = true;
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

  addOptionSet(id, p_id) {
    let index: any = this.obj
      .map(function(obj, index) {
        if (obj.option_set_id === p_id) {
          return index;
        }
      })
      .filter(isFinite);

    if (index.length > 0) {
      this.obj.splice(index[0], 1);
    }
    let obj = { option_id: id, option_set_id: p_id };
    this.obj.push(obj);
  }
  mangeOption(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }

    if (this.obj.length === 0) {
      this.snotifyService.warning("Please select option", "Warning !");
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

    this.variants.push(new ProductVariant(this.product_variant));
    this.variants[this.variants.length - 1].options = this.obj;
    this.variants[this.variants.length - 1].images = this.lImages;
    this.lImages = new Array<Image>();
    this.product_variant.sku = "";
    this.obj = [];
    this.resetDropzone();
  }

  editVariant(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    if (!this.product_variant.amount) {
      this.snotifyService.warning("Please Enter Amount");
      return;
    }
    this.spinnerService.requestInProcess(true);
    let a = this.directiveRef.dropzone();
    for (const iterator of a.files) {
      this.addPicture(iterator);
    }
    setTimeout(() => {
      this.updateVariant();
    
    }, 1000);
    this.resetDropzone();
  }

  updateVariant() {
    delete this.product_variant.product_variant_attributes;
    let tmpImages = [];
    if (this.lImages.length === 0) {
      tmpImages = this.product_variant.images;
    }
    this.product_variant.images = this.lImages;
    this.productService.updateProductVariant(this.productID, this.product_variant).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        if (this.product_variant.images.length > 0){
          this.router.navigate(['/products']);
        }
        this.product_variant.images = tmpImages;
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      });
  }

  saveProduct() {
    if (this.variants.length === 0) {
      this.snotifyService.warning("Please add option", "Warning !");
      return;
    }

    let objct;
    this.productVariant = this.variants;
    // this.productVariant[0].options = this.obj;
    objct = {
      supplier_id: this.supplierId,
      id: this.productId,
      variants: this.productVariant
    };
    this.spinnerService.requestInProcess(true);

    this.productService.saveProduct(objct, "ps_variants").subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  deleteVariant(variantId: number) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProductVariant(variantId);
      }
      this.confirmDialogRef = null;
    });
  }

  deleteProductVariant(variant_id: number) {
    this.productService.deleteProductVariant(this.productID, variant_id).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        let index = this.variants.findIndex(variant => variant.id === variant_id);
        this.variants.splice(index, 1);
        this.product_variant = new ProductVariant();
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.message);
        this.snotifyService.error(e, "Error !");
      });
  }

  onUploadError(evt) {}
  onUploadSuccess(evt) {
    // this.image = new Image();
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

  removeImage(image_id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.productService.deleteProductVariantImage(+this.product_variant.id, image_id).subscribe(
          res => {
            this.spinnerService.requestInProcess(false);
            if (!res.error) {
              this.snotifyService.success("Deleted successfully !", "Success");
              const result = this.product_variant.images.findIndex(
                image => image.id === image_id
              );
              if (result !== -1) {
                this.product_variant.images.splice(result, 1);
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

  resetDropzone(): void {
    this.directiveRef.reset();
  }
}

export class Options {
  id: number;
  name: string;
  operation: number;
  changed_by: number;
  amount: number;
  constructor(option?) {
    option = option || {};
    this.id = option.id;
    this.name = option.name;
    this.operation = option.operation;
    this.changed_by = option.changed_by;
    this.amount = option.amount;
  }
}

export class OptionSet {
  id: number;
  supplier_id: number;
  option_set_id: number;
  name: string;
  options: Options[];
  constructor(optionSet?) {
    optionSet = optionSet || {};
    this.id = optionSet.id;
    this.option_set_id = optionSet.option_set_id;
    this.name = optionSet.name;
    this.options = new Array<Options>();
  }
}
