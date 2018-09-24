import { Option } from "./../../models/product.model";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { ProductVariant } from "../../models/product.model";
import { NgForm, FormGroup, FormControl } from "@angular/forms";

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
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService
  ) {
    this.product_variant = new ProductVariant();
    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }

  ngOnInit() {
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
          let optionSet: any = localStorage.getItem("optionSet");
          if (optionSet) {
            optionSet = JSON.parse(optionSet);
            this.setOptions(optionSet);
          }
          break;
      }
    }
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
    console.log(this.getOption(id));
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
    let obj = { option_id: id, option_set_id: p_id };

    const res = this.obj.find(
      item => item.option_set_id === p_id && item.option_id === id
    );
    if (res) {
      this.snotifyService.warning(
        "Already taken, Could not select again",
        "Warning !"
      );
      return;
    }
    this.obj.push(obj);
  }
  mangeOption(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
    }
    if (this.obj.length === 0) {
      this.snotifyService.warning("Please select option", "Warning !");
      return;
    }
    this.variants.push(this.product_variant);
    this.variants[this.variants.length - 1].options = this.obj;
    this.product_variant.sku = "";
  }
  saveProduct(form) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
    }
    if (!this.obj) {
      this.snotifyService.warning("Please select option", "Warning !");
      return;
    }
    let objct;
    // this.product_variant.options = this.obj;
    this.productVariant.push(this.product_variant);
    this.productVariant[0].options = this.obj;
    objct = {
      supplier_id: this.supplierId,
      id: this.productId,
      variants: this.productVariant
    };
    this.spinnerService.requestInProcess(true);
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
