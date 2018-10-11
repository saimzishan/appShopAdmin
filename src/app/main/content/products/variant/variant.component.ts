import { Option } from "./../../models/product.model";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { ProductVariant, Image } from "../../models/product.model";
import { NgForm, FormGroup, FormControl } from "@angular/forms";
import * as _ from "lodash";
declare var $: any;
import { DropzoneDirective, DropzoneComponent } from "ngx-dropzone-wrapper";

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
  isAddorEditSKU = false;
  productVariant: ProductVariant[] = new Array<ProductVariant>();
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

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
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
          this.edit(res.value.product_variants);
          break;
      }
    }
  }

  edit(obj) {
    this.pageType = "edit";
    this.variants = obj;
    this.isAddorEditSKU = true;
  }
  editSku(variant) {
    console.log(variant);
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
  resetDropzone(): void {
    this.directiveRef.reset();
  }
}
export class Options {
  name: string;
  operation: number;
  changed_by: number;
  amount: number;
  constructor(option?) {
    option = option || {};
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
