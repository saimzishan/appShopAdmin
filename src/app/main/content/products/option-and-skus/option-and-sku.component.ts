import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import * as _ from "lodash";

@Component({
  selector: "app-option-and-sku-form",
  templateUrl: "./option-and-sku.component.html"
})
export class OptionAndSkusComponent implements OnInit {
  option_set_id = [];
  optionSets: any;
  optionSetWithValue: {};
  optionSet: OptionSet[] = new Array<OptionSet>();
  options: Options[] = new Array<Options>();
  product_id;
  supplier_id;
  changesSubscription;
  alreadyTaken: any = false;
  product_supplier_attributes: any;
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService
  ) {
    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }

  ngOnInit() {
    this.getOptionSets();
    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.supplier_id = current_product.supplier.id;
      this.product_id = current_product.id;
    }
  }

  callRelatedFunctions(res) {
    if (res.hasOwnProperty("option")) {
      switch (res.option) {
        case "addproduct":
          let current_product: any = localStorage.getItem("current_product");
          if (current_product) {
            current_product = JSON.parse(current_product);
            this.supplier_id = current_product.supplier.id;
            this.product_id = current_product.id;
          }
          break;
        case "editProduct":
          this.edit(res.value.product_supplier_attributes);
          break;
      }
    }
  }
  edit(obj) {
    const unique = Array.from(new Set(obj.map(item => item.option_set_id)));
    setTimeout(() => {
      this.option_set_id = unique;
    }, 1000);
    this.product_supplier_attributes = obj;
  }
  getOptionSets() {
    this.spinnerService.requestInProcess(true);
    this.productService.getOptionSets().subscribe(
      (res: any) => {
        if (!res.status) {
          this.optionSets = res.res.data;
          this.alreadyTaken = localStorage.getItem("optionSet");
          if (this.alreadyTaken) {
            this.alreadyTaken = JSON.parse(this.alreadyTaken);
            this.alreadyTaken.forEach(element => {
              this.option_set_id.push(element.option_set_id);
            });
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

  getOptionName(id) {
    const res = this.optionSets.find(option => option.id === id);
    if (res) {
      // console.log(res);
      return res.options;
    }
  }

  getOptionSetName(id) {
    const result = this.optionSets.find(option => option.id === id);
    if (result) {
      return result.name;
    }
  }
  removeOptionSet(id) {
    let optionSet: any = localStorage.getItem("optionSet");
    if (optionSet) {
      optionSet = JSON.parse(optionSet);

      const result = optionSet.find(option => option.option_set_id === id);
      if (result) {
        this.snotifyService.warning("Could not be removed...", "Warning !");
        return;
      }
    }
    this.option_set_id = _.without(this.option_set_id, id);
  }

  handleSelection(event, value) {}

  saveOptionSetAndValue(option_set_id, option, operation, change_by, amount) {
    if (change_by === undefined || operation === undefined || amount === "") {
      this.snotifyService.warning(
        "Please select Opration, Change by and and add amount",
        "Warning !"
      );
      return;
    }
    if (this.optionSet.length === 3) {
      this.snotifyService.warning("Maximum limit 3", "Warning !");
      return;
    }
    // check if already added
    const result = this.optionSet.find(
      option => option.option_set_id === option_set_id
    );
    // check if already added
    if (!result) {
      this.optionSet.push(
        new OptionSet({
          id: this.product_id,
          option_set_id: option_set_id,
          supplier_id: this.supplier_id,
          name: this.getOptionSetName(option_set_id)
        })
      );
    }
    let index: any = this.optionSet
      .map(function(obj, index) {
        if (obj.option_set_id === option_set_id) {
          return index;
        }
      })
      .filter(isFinite);
    this.optionSet[index].options.push({
      operation: operation,
      changed_by: change_by,
      amount: amount,
      id: option.id,
      name: option.value
    });
    this.optionSetWithValue = {
      id: this.product_id,
      supplier_id: this.supplier_id,
      option_set_id: option_set_id,
      option_id: option.id,
      operation: operation,
      changed_by: change_by,
      amount: amount
    };
    this.saveProduct(this.optionSetWithValue);
  }

  saveProduct(obj) {
    this.spinnerService.requestInProcess(true);
    this.spinnerService.requestInProcess(true);

    this.productService.saveProduct(obj, "ps_options").subscribe(
      (res: any) => {
        this.optionSetWithValue = {};
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        localStorage.removeItem("optionSet");
        localStorage.setItem("optionSet", JSON.stringify(this.optionSet));
        this.detectChangesService.notifyOther({
          value: this.optionSet,
          option: "optionsAdded"
        });
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
  id: number;
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
