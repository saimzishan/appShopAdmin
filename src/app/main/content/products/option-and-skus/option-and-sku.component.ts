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
  optionSetValues = [];
  @Input()
  product_id;
  @Input()
  supplier_id;
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) { }

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

  handleSelection(event, value) { }

  saveOptionSetAndValue(option_st_id, option, operation, change_by, amount) {
    this.optionSetValues.push(this.optionSetWithValue = {
      supplier_id: this.supplier_id,
      product_id: this.product_id,
      option_set_id: option_st_id,
      name: this.getOptionSetName(option_st_id),
      options: {
        name: option.name,
        option_id: option.id,
        operation: operation,
        change_by: change_by,
        amount: amount
      },
    });
    console.log(this.optionSetValues);
  }


  // saveOptionSetAndValue(option_st_id, option, operation, change_by, amount) {
  //     this.optionSetValues.push(this.optionSetWithValue = {
  //     id: this.product_id,
  //     supplier_id: this.supplier_id,
  //     option_set_id: option_st_id,
  //     name: this.getOptionSetName(option_st_id),
  //     // options: {
  //     //   option_id: option.id,
  //     //   operation: operation,
  //     //   changd
  //     // }
  //     // option_id: option,
  //     // operation: operation,
  //     // changed_by: change_by,
  //     // amount: amount
  //   });
  //   console.log(this.getOptionSetName(option_st_id));
  //   // console.log(option);
  //   // return;
  //   // if (change_by === undefined || operation === undefined || amount === "") {
  //   //   this.snotifyService.warning(
  //   //     "Please select Opration, Change by and add amount",
  //   //     "Warning !"
  //   //   );
  //   //   return;
  //   // }
  //   // this.optionSetValues.push(this.optionSetWithValue = {
  //   //   id: this.product_id,
  //   //   supplier_id: this.supplier_id,
  //   //   option_set_id: option_st_id,
  //   //   option_id: option_id,
  //   //   operation: operation,
  //   //   changed_by: change_by,
  //   //   amount: amount
  //   // });
  //   // this.optionSetValues.push(this.optionSetWithValue);

  //   // this.optionSetValues.push({
  //   //   id: 1,
  //   //   supplier_id: 1,
  //   //   option_set_id: option_st_id,
  //   //   // name: "Size",
  //   //   options: [
  //   //     {
  //   //       option_id: option_id,
  //   //       // name: "small",
  //   //       operation.id: 1,
  //   //       changed_by: 1,
  //   //       amount: 10
  //   //     },
  //   //   ]
  //   // });
  //   // console.log(this.optionSetValues);
  //   this.optionSetWithValue = {};
  //   return;
  //   this.saveProduct(this.optionSetWithValue);
  // }

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
