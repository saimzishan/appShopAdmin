import { Component, OnInit } from "@angular/core";
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Tag } from "../../models/tag.model";
import { DetectChangesService } from "./../../../../shared/detect-changes.services";

@Component({
  selector: "app-tage",
  templateUrl: "./tage.component.html"
})
export class TageComponent implements OnInit {
  tags: Tag[];
  tagId;
  supplierId: any;
  productId: any;
  changesSubscription: any;
  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private detectChangesService: DetectChangesService
  ) {
    this.tags = new Array<Tag>();
    this.tagId = [];
    this.changesSubscription = this.detectChangesService.notifyObservable$.subscribe(
      res => {
        this.callRelatedFunctions(res);
      }
    );
  }
  ngOnInit() {
    this.index();
    this.init();
  }

  index() {
    this.spinnerService.requestInProcess(true);
    this.productService.getTags().subscribe(
      (res: any) => {
        if (!res.status) {
          this.tags = res.res.data;
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
  init() {
    let current_product: any = localStorage.getItem("current_product");
    if (current_product) {
      current_product = JSON.parse(current_product);
      this.supplierId = current_product.supplier.id;
      this.productId = current_product.product_id;
    }
  }
  edit(obj) {
    setTimeout(() => {
      for (const iterator of obj) {
        let id = this.tags.findIndex(i => i.id === iterator.id);
        if (id !== -1) {
          this.tags[id].selected = true;
        }
      }
    }, 1000);
  }
  callRelatedFunctions(res) {
    if (res.hasOwnProperty("option")) {
      switch (res.option) {
        case "addproduct":
          this.init();
          break;
        case "editProduct":
          this.edit(res.value.tags);
          break;
      }
    }
  }

  put() {
    if (this.tagId.length === 0) {
      this.snotifyService.warning("Please select atleast one tag", "Warning !");
      return;
    }
    const obj = {
      supplier_id: this.supplierId,
      id: this.productId,
      tags: this.tagId
    };
    this.spinnerService.requestInProcess(true);
    this.productService.saveProduct(obj, "p_tags").subscribe(
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
