import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "../product.service";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Tag } from "../../models/tag.model";
import { TagsService } from "../../tags/tags.service";

@Component({
  selector: "app-tage",
  templateUrl: "./tage.component.html"
})
export class TageComponent implements OnInit {
  @Input() selectedTags: number[];
  @Input() pageType: string;
  tags: Tag[];
  supplierId: any;
  productId: any;
  changesSubscription: any;
  sub: any;
  productID: number;
  supplierID: number;
  constructor(
    private productService: ProductService,
    private tagService: TagsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private route: ActivatedRoute
  ) {
    this.getAllTags();
  }
  ngOnInit() {
    this.setProductSupplierIds();
  }

  getAllTags() {
    this.spinnerService.requestInProcess(true);
    this.tagService.getTags().subscribe(
      (res: any) => {
        if (res) {
          this.tags = res.res.data;
          if (this.pageType === 'edit')
          this.bindSelectedTags();
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      });
  }

  bindSelectedTags() {
    this.selectedTags.forEach(item => {
      let index = this.tags.findIndex(tag => tag.id === item);
      if (index !== -1) {
        this.tags[index].selected = true;
      }
    });
  }

  updateProductTags() {
    this.setProductSupplierIds();
    if (this.selectedTags.length === 0) {
      this.snotifyService.warning("Please select atleast one tag", "Warning !");
      return;
    }
    this.spinnerService.requestInProcess(true);
    let updatedTags = {
      tags: this.selectedTags
    }
    this.productService.updateProductTags(this.productID, updatedTags).subscribe(
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

  setProductSupplierIds() {
    this.sub = this.route.params.subscribe(params => {
      let product_id;
      let supplier_id;
      if (this.pageType === 'edit') {
        product_id = params['id'] || '';
        supplier_id = params['supplier_id'] || '';
        this.productID = parseInt(product_id, 10);
        this.supplierID = parseInt(supplier_id, 10);
      } else if (this.pageType === 'new') {
        let ps_ids: any = localStorage.getItem('_saveP');
        ps_ids = JSON.parse(ps_ids);
        product_id = ps_ids._p_id;
        supplier_id = ps_ids._s_id;
        this.productID = parseInt(product_id, 10);
        this.supplierID = parseInt(supplier_id, 10);
      }
    });
  }
}
