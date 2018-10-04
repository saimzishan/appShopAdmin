import { Router } from "@angular/router";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import {
  Supplier,
  OptionSet,
  OptionValue,
  ProductVariant,
  Options
} from "./../models/product.model";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { MatSnackBar, MatDialog, MatDialogRef } from "@angular/material";

import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";

import * as _ from "lodash";

declare var $: any;

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProductComponent implements OnInit, OnDestroy {
  bluckPrice: BluckPrice = new BluckPrice();
  bluckPrices: BluckPrice[];

  ps_panelOpenState = true;
  ps_sku_panelOpenState = false;
  ps_v_panelOpenState = false;

  viewChildren = false;
  pageType: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;

  product_id: any;
  supplier_id: any = false;
  // enabledChild: boolean = true;
  enableOptionChild = false;
  enableVariantChild = false;

  constructor(
    private dialog: MatDialog,
    protected http: HttpClient,
    private router: Router
  ) {
    this.bluckPrices = new Array<BluckPrice>();
  }

  ngOnInit() {
    // Subscribe to update product on changes
  }
  onProductSaved(evt) {
    this.product_id = evt.id;
    this.supplier_id = evt.supplier_id;
    this.enableOptionChild = false;
  }

  enableChildren() {
    this.viewChildren = true;
  }

  disableChildren() {
    this.viewChildren = false;
  }

  deleteProduct() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      this.confirmDialogRef = null;
    });
  }
  saveAndExit() {
    localStorage.removeItem("current_product");
    localStorage.removeItem("current_product_sp_images");
    localStorage.removeItem("optionSet");
    this.router.navigate(["/products"]);
  }

  // scrollToId() {
  //   $("#middleOfPanel")[0].scrollIntoView();
  // }

  ngOnDestroy() {}
}

export class BluckPrice {
  from: number;
  to: number;
  discount: number;
  changeBy: number;
  product_supplier_id: number;
  constructor(bluckPrice?) {
    bluckPrice = bluckPrice || {};
    this.from = bluckPrice.from;
    this.to = bluckPrice.to;
    this.discount = bluckPrice.discount;
    this.changeBy = bluckPrice.changeBy;
    this.product_supplier_id = bluckPrice.product_supplier_id;
  }
}
