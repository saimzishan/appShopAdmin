import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import _ = require("lodash");
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
  isAddorEditSKU: boolean = false;
  productVariant: ProductVariant[] = new Array<ProductVariant>();

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.product_variant = new ProductVariant();
  }

  ngOnInit() {
    if (this.option_with_value.length === 0) {
      this.option_with_value.push(
        new OptionSet({
          id: 1,
          supplier_id: 1,
          option_set_id: 1,
          name: "Size"
        })
      );
    }
    this.option_with_value.push(
      new OptionSet({
        id: 2,
        supplier_id: 1,
        option_set_id: 1,
        name: "Color"
      })
    );

    this.option_with_value[0].options.push(
      new Options({
        name: "larg",
        operation: 1,
        changed_by: 1,
        amount: 12
      })
    );
    this.option_with_value[0].options.push(
      new Options({
        name: "small",
        operation: 1,
        changed_by: 1,
        amount: 10
      })
    );

    this.option_with_value[1].options.push(
      new Options({
        name: "Red",
        operation: 1,
        changed_by: 1,
        amount: 12
      })
    );
    this.option_with_value[1].options.push(
      new Options({
        name: "Green",
        operation: 1,
        changed_by: 1,
        amount: 10
      })
    );
  }
  getOption(id) {
    const res = this.option_with_value.find(option => option.id === id);
    if (res) {
      return res.options;
    }
  }

  addOrEditSku() {
    this.isAddorEditSKU = !this.isAddorEditSKU;
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

  addSKU(form: NgForm) {
    if (form.invalid) {
      this.validateAllFormFields(form.control);
      this.snotifyService.warning("Please Fill All Required Fields");
      return;
    }
    this.productVariant.push(new ProductVariant(this.product_variant));
    this.isAddorEditSKU = !this.isAddorEditSKU;
    form.resetForm();
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
