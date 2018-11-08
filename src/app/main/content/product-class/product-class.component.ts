import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GLOBAL } from "../../../shared/globel";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { ProductClassService } from "./product-class.service";


@Component({
  selector: "app-product-class",
  templateUrl: "./product-class.component.html",
  styleUrls: ["./product-class.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProductClassComponent implements OnInit {

  params: any;
  option: string;
  product: any;
  displayedColumns = [
    "name",
    "supplier",
    "image",
    "action",
    "edit"
  ];
  dataSource;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  supplier_id: any;
  product_id: any;
  selectedSupplier: any;
  totalItems: number;
  perPage: number;
  addedSuppliers: any[];
  enableImage = false;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


  baseURL = GLOBAL.USER_IMAGE_API;

  constructor(
    private productClassService: ProductClassService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.params = window.location.href;
    this.option = this.params.split('/');
    this.option = this.option[5];
    if ((this.option === 'slider') || (this.option === 'banner')) {
      this.enableImage = true;
      console.log('true');
    } else {
      console.log('false');
    }
    this.getProductofClasses(this.option);
  }

  getProductofClasses(option) {
    this.spinnerService.requestInProcess(true);
    this.productClassService.getProductClassDetails(option).subscribe(
      (res: any) => {
        // this.product = res.res.data[0];
        this.setDataSuorce(res.res.data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSuorce(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeClass(event, id, product_classes) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (var i = product_classes.length - 1; i >= 0; i--) {
          if (product_classes[i] === this.option) {
            product_classes.splice(i, 1);
          }
        }
        if (product_classes.length === 0) {
          product_classes.push('none');
        }
        const obj = {
          ps_id: id,
          class: product_classes
        };
        this.spinnerService.requestInProcess(true);
        this.productClassService.updateClass(obj).subscribe(
          (res: any) => {
            this.snotifyService.success('Removed from' + this.option);
            this.getProductofClasses(this.option);
            this.spinnerService.requestInProcess(false);
          },
          errors => {
            this.spinnerService.requestInProcess(false);
            let e = errors.error.message;
            this.snotifyService.error(e, "Error !");
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  imageView(original_image) {
    let spliting = original_image;
    spliting = spliting.split('/');
    if (spliting[0] === '') {
      return this.baseURL + original_image;
    } else {
      return original_image;
    }
  }
}
