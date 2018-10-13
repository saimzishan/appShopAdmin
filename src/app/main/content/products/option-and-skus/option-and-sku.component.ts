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
  product_supplier_attributes: any = [];
  pageType = "new";
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService
  ) { }

  ngOnInit() {
    this.getOptionSets();
    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.supplier_id = current_product.supplier.id;
      this.product_id = current_product.id;
    }

    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
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
          this.pageType = "edit";
          this.product_id = res.value.ps_id;
          this.supplier_id = res.value.supplier_id;
          this.edit(res.value.product_supplier_attributes);
          break;
      }
    }
  }
  edit(obj) {
    this.product_supplier_attributes = obj;
    this.spinnerService.requestInProcess(true);
    const unique = Array.from(new Set(obj.map(item => item.option_set_id)));
    setTimeout(() => {
      this.option_set_id = unique;
      this.spinnerService.requestInProcess(false);
    }, 5000);
  }
  setDefault() {
    for (const iterator of this.optionSets) {
      iterator.options.forEach(element => {
        let res = this.product_supplier_attributes.find(
          select => select.option.id === element.id
        );
        if (res) {
          element.ps_id = res.id;
          element.isSelected = true;
          element.amount = res.amount;
          element.change_by = res.change_by === "absolute" ? 1 : 2;
          element.operation = res.operation === "add" ? 2 : 3;
          element.option_id = res.option.id;
        } else {
          element.isSelected = false;
          element.amount = null;
          element.change_by = null;
          element.operation = null;
          element.option_id = null;
        }
      });
    }
  }
  getOptionSets() {
    this.spinnerService.requestInProcess(true);
    this.productService.getOptionSets().subscribe(
      (res: any) => {
        if (!res.status) {
          this.optionSets = res.res.data;
          if (this.pageType !== "new") {
            this.setDefault();
          }
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
    const res: any = this.optionSets.find(option => option.id === id);
    if (res) {
      let obj = [];
      if (this.pageType === "edit") {
        obj = res.options;
      } else {
        obj = res.options;
      }
      return obj;
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

  handleSelection(event, value) { }

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
    const result = this.optionSet.find(
      option => option.option_set_id === option_set_id
    );
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
      .map(function (obj, index) {
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

  editOptionSetValue(
    option_id: number,
    operation: number,
    change_by: number,
    amount: number
  ) { }

  deleteOptionSetValue(ps_id: number) {
    this.spinnerService.requestInProcess(true);
    this.productService.deleteOptionValue(this.product_id, ps_id).subscribe(
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
