import { ActivatedRoute } from "@angular/router";
import { ProductSupplierAttribute } from "./../../models/product.model";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";
import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import * as _ from "lodash";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material";
import { MatDialog } from "@angular/material";

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
  product_supplier_attributes: any = [];
  @Input()
  ps_attributes: ProductSupplierAttribute[];
  @Input()
  pageType: string;
  @Input()
  ps_id: number;
  sub: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setPSIds();
    if (this.pageType === "edit") {
      this.edit(this.ps_attributes);
    }
    this.getOptionSets();

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
          select => select.option_id === element.id
        );
        if (res) {
          element.ps_id = res.id;
          element.isSelected = true;
          element.amount = res.amount;
          element.changed_by = res.changed_by === "absolute" ? 1 : res.changed_by === null ? '' : 2;
          element.operation = res.operation === "none" ? 1 : res.operation === "add" ? 2 : 3;
          element.option_id = res.option_id;
        } else {
          element.isSelected = false;
          element.amount = null;
          element.changed_by = null;
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
        obj.forEach(element => {
          if (element.isSelected === false) {
            element.operation = 2;
            element.changed_by = 1;
          }
        });
      } else {
        obj = res.options;
        obj.forEach(element => {
          element.amount = null;
          element.operation = 2;
          element.changed_by = 1;
        });
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

  handleSelection(event, value) {}

  saveOptionSetAndValue(option_set_id, option, operation, change_by, amount) {
    this.setPSIds();

    if (amount === "") {
      this.snotifyService.warning("Please enter Amount", "Warning !");
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
      id: this.ps_id,
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
        let index = this.optionSets.findIndex(
          op_set => op_set.id === obj.option_set_id
        );
        let opt_index = this.optionSets[index].options.findIndex(
          opt => opt.id === obj.option_id
        );
        this.optionSets[index].options[opt_index].isSelected = true;
        this.optionSets[index].options[opt_index].ps_id = res.res.data.id;
        this.optionSets[index].options[opt_index].amount = res.res.data.amount;
        this.optionSets[index].options[opt_index].changed_by =
          res.res.data.changed_by;
        this.optionSets[index].options[opt_index].operation =
          res.res.data.operation;
        this.optionSets[index].options[opt_index].option_id =
          res.res.data.option_id;
        // Updation after add new value
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
    ps_id: number,
    optionSet_id: any,
    option_id: number,
    operation: number,
    change_by: number,
    amount: number
  ) {
    this.spinnerService.requestInProcess(true);
    let optionValue = {
      supplier_id: this.supplier_id,
      option_set_id: optionSet_id,
      option_id: option_id,
      operation: operation,
      changed_by: change_by,
      amount: amount
    };
    this.productService
      .updateOptionValue(this.product_id, ps_id, optionValue)
      .subscribe(
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

  deleteOptionSetValue(p_id, ps_id: number) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.requestInProcess(true);
        this.productService.deleteOptionValue(this.product_id, ps_id).subscribe(
          (res: any) => {
            this.optionSetWithValue = {};
            this.snotifyService.success(res.res.message, "Success !");
            this.spinnerService.requestInProcess(false);
            let index = this.optionSets.findIndex(op_set => op_set.id === p_id);
            let opt_index = this.optionSets[index].options.findIndex(
              opt => opt.ps_id === ps_id
            );

            this.optionSets[index].options[opt_index].isSelected = false;
            this.optionSets[index].options[opt_index].amount = null;
            this.optionSets[index].options[opt_index].changed_by = null;
            this.optionSets[index].options[opt_index].operation = null;
            this.optionSets[index].options[opt_index].option_id = null;
            // Updation after deletion
          },
          errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.error;
            e = JSON.stringify(e.message);
            this.snotifyService.error(e, "Error !");
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }
  setPSIds() {
    this.sub = this.route.params.subscribe(params => {
      let product_id;
      let supplier_id;
      if (this.pageType === "edit") {
        product_id = params["id"] || "";
        supplier_id = params["supplier_id"] || "";
        this.product_id = +product_id;
        this.supplier_id = +supplier_id;
      } else if (this.pageType === "new") {
        let ps_ids: any = localStorage.getItem("_saveP");
        if (ps_ids) {
          ps_ids = JSON.parse(ps_ids);
          product_id = ps_ids._p_id;
          supplier_id = ps_ids._s_id;
          let ps_id = ps_ids._ps_id;
          this.product_id = +product_id;
          this.supplier_id = +supplier_id;
          this.ps_id = +ps_id;
        }
      }
    });
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
