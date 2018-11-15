import { Category } from "./../../models/category.model";
import {
  Component,
  Input,
  OnInit,
  ViewChildren,
  Directive,
  EventEmitter,
  Output
} from "@angular/core";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { CategoriesService } from "../categories.service";
import { Router } from "@angular/router";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef, MatDialog } from "@angular/material";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "../../../../shared/globel";
import { ITreeOptions } from "angular-tree-component";

// @Directive({
//     selector:'[my-custom-directive]',
//     exportAs:'customdirective'   //the name of the variable to access the directive
//   })

@Component({
  selector: "category-child",
  template: `
    <mat-accordion>
        <mat-expansion-panel (opened)="show(category.id)" [disabled]="!hasChild(category)">
            <mat-expansion-panel-header>
                <mat-panel-title class="col-md-3"> {{category.name}}</mat-panel-title>
                <mat-panel-title class="col-md-2">
                <ng-container *ngIf="category.children.length == 0">{{category.product_count}}</ng-container> </mat-panel-title>
                <mat-panel-title class="col-md-1">
                    <ng-container>
                        <button mat-icon-button [matMenuTriggerFor]="menu">
                            <mat-icon>more_horiz</mat-icon>
                        </button>
                        <mat-menu #menu="matMenu" overlapTrigger="false">
                          <tree-root class="expand-tree" #tree [options]="options" (click)="$event.stopPropagation()" [nodes]="nodes" (activate)="activeNodes(tree.treeModel , category.id)"></tree-root>
                        </mat-menu>
                    </ng-container>
                </mat-panel-title>
                <mat-panel-title class="col-md-2"> {{getSpecificNotes(category.notes)}}</mat-panel-title>
                <mat-panel-title class="col-md-2"> {{category.children.length}}</mat-panel-title>
                <mat-panel-title class="col-md-2"> 
                  <mat-icon class="active-icon mat-green-600-bg s-26" (click)="editCategory(category.id)" style="margin-right: 10%;cursor:pointer">edit</mat-icon>
                </mat-panel-title>
            </mat-expansion-panel-header>
            <ng-container *ngIf="hasChild(category)">
                <ng-container *ngFor="let cate of categoryChildren">
                    <category-child [category]='cate'  > </category-child>
                </ng-container>
            </ng-container>    
        </mat-expansion-panel>
    </mat-accordion>  
    `,
  styleUrls: ["./child.component.scss"]
})
export class CategoryChildComponent implements OnInit {
  @Input()
  category: Category;
  categoryChildren: any;
  categories;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


  @Output() categoryMoved = new EventEmitter<string>();

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };

  nodes: any[] = [];

  asyncChildren = [
    {
      name: "child1",
      hasChildren: true
    },
    {
      name: "child2"
    }
  ];
  parentCat: any;
  newNodes: (
    | { name: string; hasChildren: boolean }
    | { name: string; hasChildren?: undefined })[];
  parentCatId: any;

  constructor(
    private categoriesService: CategoriesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private router: Router,
    private dialog: MatDialog,
    protected http: HttpClient
  ) {
    this.categoryChildren = [];
  }
  ngOnInit() {
    this.index();
  }
  hasChild(category: Category): boolean {
    if (category && category.children) {
      return Boolean(category.children.length > 0);
    }
    return false;
  }
  getSpecificNotes(notes: string): string {
    let res = "";
    if (!notes) {
      res = " ";
    } else if (notes.length < 20) {
      res = notes;
    } else {
      res = notes.substring(0, 20) + " ...";
    }
    return res;
  }
  show(id) {
    if (!id) {
      return;
    }
    this.spinnerService.requestInProcess(true);
    this.categoriesService.edit(id).subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        if (!res.status) {
          this.categoryChildren = res.res.data;
        }
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  editCategory(id) {
    this.router.navigate(["/categories/" + id]);
  }

  index() {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.getCategories().subscribe(
      (res: any) => {
        if (!res.status) {
          this.categories = res.res.data;
          this.nodes = this.createNode(this.categories);
          // this.setDataSource(this.categories);
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
        // this.notificationServiceBus.launchNotification(true, e);
      }
    );
  }

  moveCategory(value, id) {
    if (value == id) {
      this.snotifyService.warning('Products are Already in this Category');
      return;
    }
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to move?";

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moveProducts(id, value);
      }
      this.confirmDialogRef = null;
    });
  }

  moveProducts(old_id, new_id) {
    const obj = {
      from: new_id,
      to: old_id
    };
    this.spinnerService.requestInProcess(true);
    this.categoriesService.moveProductsCategory(obj).subscribe(
      (res: any) => {
        if (!res.status) {
          this.snotifyService.success(res.res.message);
          // this.router.navigate(["/categories"]);
          this.callParent();
        }
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
        // this.notificationServiceBus.launchNotification(true, e);
      }
    );
  }

  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      this.spinnerService.requestInProcess(true);
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      };
      this.http
        .get(GLOBAL.USER_API + "categories/" + node.data.my_id, httpOptions)
        .subscribe((response: any) => {
          if (!response.error) {
            resolve(this.createNode(response.data));
          } else {
            this.snotifyService.error(response.error);
          }
          this.spinnerService.requestInProcess(false);
        }, reject);
    });
  }

  activeNodes(treeModel: any, old_id) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    if (treeModel.activeNodes[0].data.hasChildren === true) {
      this.snotifyService.warning('Please Select Child Category');
      this.parentCat = '';
      return;
    } else {
      this.parentCatId = treeModel.activeNodes[0].data.my_id;
      this.moveCategory(old_id, this.parentCatId);
    }
  }

  createNode(obj) {
    let tempNode = [];
    obj.forEach(row => {
      let tempObj = {};
      if (row.children.length > 0) {
        tempObj = {
          name: row.name,
          hasChildren: true,
          my_id: row.id
        };
      } else {
        tempObj = { name: row.name, my_id: row.id };
      }
      tempNode.push(tempObj);
    });
    return tempNode;
  }

  callParent() {
    this.categoryMoved.emit();
  }
}
