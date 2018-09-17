import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import _ = require("lodash");

@Component({
  selector: "app-option-and-sku-form",
  templateUrl: "./option-and-sku.component.html"
})
export class OptionAndSkusComponent implements OnInit {
  option_set_id = [];
  optionSets: any;
  optionSetWithValue: {};
  @Input()
  product_id;
  @Input()
  supplier_id;
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.getOptionSets();
  }

  getOptionSets() {
    this.spinnerService.requestInProcess(true);
    this.productService.getOptionSets().subscribe(
      (res: any) => {
        if (!res.status) {
          this.optionSets = res.res.data;
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
    this.option_set_id = _.without(this.option_set_id, id);
  }

  handleSelection(event, value) {}

  saveOptionSetAndValue(option_st_id, option_id, operation, change_by, amount) {
    if (change_by === undefined || operation === undefined || amount === "") {
      this.snotifyService.warning(
        "Please select Opration, Change by and and add amount",
        "Warning !"
      );
      return;
    }
    this.optionSetWithValue = {
      id: this.product_id,
      supplier_id: this.supplier_id,
      option_set_id: option_st_id,
      option_id: option_id,
      operation: operation,
      changed_by: change_by,
      amount: amount
    };
    this.saveProduct(this.optionSetWithValue);
  }
  saveProduct(obj) {
    this.spinnerService.requestInProcess(true);
    this.spinnerService.requestInProcess(true);

    this.productService.saveProduct(obj).subscribe(
      (res: any) => {
        this.optionSetWithValue = {};
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
