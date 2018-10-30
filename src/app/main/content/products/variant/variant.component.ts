import { GLOBAL } from "./../../../../shared/globel";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import {
  ProductVariant,
  Image,
  Variant,
  Supplier
} from "../../models/product.model";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { Option } from "../../models/option.model";

@Component({
  selector: "app-variant-form",
  templateUrl: "./variant.component.html",
  styleUrls: ["./variant.component.scss"]
})
export class VariantComponent implements OnInit {
  @Input()
  productVariants: ProductVariant;
  @Input()
  productSupplier: any;
  @Input()
  pageType: string;
  @Input()
  ps_id: number;
  variant: Variant;
  productID: number;
  supplierID: number;
  baseURL = GLOBAL.USER_IMAGE_API;
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;
  sub: any;
  productOptionSetAndValue: Option[];
  optionSets;
  optionID: number;
  optionSetID: number;
  OoptionSetID: number;
  OotionID: number;

  @Input()
  option_with_value: OptionSet[] = new Array<OptionSet>();
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  option_skus;
  enableOptions = false;
  product_variant_attributes = [];
  supplierId = -1;
  productId = -1;
  images: Image[];
  image: Image;
  lImages: any = [];
  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;
  isEdit = false;
  isNewPressed = false;
  isAction = false;

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.images = new Array<Image>();
    this.image = new Image();
    this.variant = new Variant();
    this.productOptionSetAndValue = new Array<Option>();
  }

  ngOnInit() {
    this.setProductSupplierIds();
    console.log(this.productVariants);
    // console.log(this.getOptionName());
    // this.getOptionName(1);
    // console.log(this.productVariants);
  }

  getProductOptionSetWithValue() {
    this.spinnerService.requestInProcess(true);
    this.productService
      .getProductOptionSetWithValue(this.productID, this.supplierID)
      .subscribe(
        (res: any) => {
          this.productOptionSetAndValue = res.res.data;
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

  mangeOption(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    if (this.product_variant_attributes.length === 0) {
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
    if (this.variant.track_stock === false) {
      this.variant.stock = 0;
      this.variant.low_level_stock = 0;
    }



    this.variant.product_variant_attributes = this.product_variant_attributes;
    this.variant.images = this.lImages;
    let pVariants = new ProductVariant();
    pVariants.supplier_id = this.supplierID;
    pVariants.variants.push(this.variant);
    return;
    this.lImages = new Array<Image>();
    this.resetDropzone();
    return this.saveProductVariants(pVariants);
  }

  saveProductVariants(productVariants?: ProductVariant) {
    if (productVariants.variants.length === 0) {
      this.snotifyService.warning("Please add option", "Warning !");
      return;
    }

    this.spinnerService.requestInProcess(true);
    this.productVariants.supplier_id = this.supplierID;
    this.productService
      .saveProductVariants(productVariants, this.ps_id, "ps_variants")
      .subscribe(
        (res: any) => {
          this.snotifyService.success(res.res.message, "Success !");
          this.variant = new Variant();
          this.productVariants.variants = res.res.data;
          this.converter(this.productVariants.variants);
          this.product_variant_attributes = [];
          this.isEdit = false;
          this.isAction = false;
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

  editVariant(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    if (!this.variant.amount) {
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
    delete this.variant.product_variant_attributes;

    this.variant.images = this.lImages;
    this.productService
      .updateProductVariant(this.productID, this.variant)
      .subscribe(
        (res: any) => {
          this.snotifyService.success(res.res.message, "Success !");
          let updatedVariant = new Variant(res.res.data);
          this.converter([updatedVariant]);
          let index = this.productVariants.variants.findIndex(
            v => v.id === updatedVariant.id
          );
          this.productVariants.variants.splice(index, 1);
          this.productVariants.variants.push(updatedVariant);
          this.variant = updatedVariant;
          this.isEdit = false;
          this.isAction = false;
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
    this.productService
      .deleteProductVariant(this.productID, variant_id)
      .subscribe(
        (res: any) => {
          this.snotifyService.success(res.res.message, "Success !");
          let index = this.productVariants.variants.findIndex(
            variant => variant.id === variant_id
          );
          this.productVariants.variants.splice(index, 1);
          this.variant = new Variant();
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

  removeImage(image_id) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.productService
          .deleteProductVariantImage(+this.variant.id, image_id)
          .subscribe(
            res => {
              this.spinnerService.requestInProcess(false);
              if (!res.error) {
                this.snotifyService.success(
                  "Deleted successfully !",
                  "Success"
                );
                const result = this.variant.images.findIndex(
                  image => image.id === image_id
                );
                if (result !== -1) {
                  this.variant.images.splice(result, 1);
                }
              }
            },
            error => {
              this.spinnerService.requestInProcess(false);
              let e = JSON.stringify(error);
              this.snotifyService.error(e, "Fail");
            }
          );
      }
      this.confirmDialogRef = null;
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  converter(variants: Variant[]) {
    if (variants.length > 0) {
      variants.forEach(variant => {
        if (variant.operation === "none") {
          variant.operation = 1;
        } else if (variant.operation === "add") {
          variant.operation = 2;
        } else if (variant.operation === "subtract") {
          variant.operation = 3;
        }
        if (variant.changed_by === "absolute") {
          variant.changed_by = 1;
        } else if (variant.changed_by === "percentage") {
          variant.changed_by = 2;
        }
      });
    }
  }

  selectVariant(selectedVariant: Variant) {
    this.isEdit = true;
    this.isNewPressed = false;
    this.isAction = true;
    this.variant = selectedVariant;
  }

  getOptions(id: number) {
    const res = this.productOptionSetAndValue.find(
      optionSet => optionSet.id === id
    );
    if (res) {
      return res.options;
    }
  }

  cancelVariant() {
    this.isEdit = false;
    this.isAction = false;
    this.variant = new Variant();
  }

  addOptionSet(option_id, option_set_id) {
    let index: any = this.product_variant_attributes
      .map(function (obj, index) {
        if (obj.option_set_id === option_set_id) {
          return index;
        }
      })
      .filter(isFinite);

    if (index.length > 0) {
      this.product_variant_attributes.splice(index[0], 1);
    }
    let pv_attribute = { option_id: option_id, option_set_id: option_set_id };
    this.product_variant_attributes.push(pv_attribute);
  }

  addPicture(obj) {
    this.image = new Image();
    this.image.base64String = obj.dataURL.split(",")[1];
    this.image.content_type = obj.type.split("/")[1];
    this.image.content_type = "." + this.image.content_type.split(";")[0];
    this.image.type = "small";

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

  resetDropzone(): void {
    this.directiveRef.reset();
  }

  setProductSupplierIds() {
    this.sub = this.route.params.subscribe(params => {
      let product_id;
      let supplier_id;
      if (this.pageType === "edit") {
        product_id = params["id"] || "";
        supplier_id = params["supplier_id"] || "";
        this.productID = parseInt(product_id, 10);
        this.supplierID = parseInt(supplier_id, 10);
        this.converter(this.productVariants.variants);
      } else if (this.pageType === "new") {
        let ps_ids: any = localStorage.getItem("_saveP");
        if (ps_ids) {
          ps_ids = JSON.parse(ps_ids);
          product_id = ps_ids._p_id;
          supplier_id = ps_ids._s_id;
          let ps_id = ps_ids._ps_id;
          this.productID = parseInt(product_id, 10);
          this.supplierID = parseInt(supplier_id, 10);
          this.ps_id = +ps_id;
        }
      }
    });
  }

  isNewVariant() {
    this.isEdit = false;
    this.isNewPressed = true;
    this.isAction = true;
    this.productSupplier.images = [];
    this.variant = this.productSupplier;
    // this.variant.amount = this.productSupplier.price;
  }

  onUploadError(event: any) { }
  onUploadSuccess(event: any) { }

  getOptionSetName(id: number) {
    const res = this.productOptionSetAndValue.find(
      optionSet => optionSet.id === id
    );
    if (res) {
      this.optionSetID = res.id;
      return res.name;
    }
  }

  getOptionValue(id) {
    const res = this.productOptionSetAndValue.find(
      optionSet => optionSet.id === id
    );

    if (res) {
      this.optionID = res.options[0].id;
      return res.options[0].value;
    }
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
