import { Category } from "./../models/category.model";
import { SnotifyService } from "ng-snotify";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CategoriesService } from "./categories.service";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { FuseUtils } from "../../../core/fuseUtils";
import { ITreeOptions, TreeNode, TreeComponent } from "angular-tree-component";
import { SpinnerService } from "../../../spinner/spinner.service";
@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  animations: fuseAnimations
})
export class CategoriesComponent implements OnInit {
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  category;
  showChild = false;
  dataSource: any;
  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };
  displayedColumns: string[] = ["name", "children", "notes"];
  panelOpenState = false;
  // displayedColumns = ["position", "name", "weight", "symbol"];
  // dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  newNodes;
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
  categories: Array<Category> = new Array<Category>();
  categoryChildren: Category;

  constructor(
    private categoriesService: CategoriesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {}

  ngOnInit() {
    this.index();
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
  openChildren() {
    this.showChild = !this.showChild;
  }
  getChildren(node: any) {
    this.show(node.data.my_id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.newNodes), 4000);
    });
  }

  setDataSource(obj) {
    this.dataSource = new MatTableDataSource<any>(obj);
    this.dataSource.paginator = this.paginator;
  }

  index() {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.getCategories().subscribe(
      (res: any) => {
        if (!res.status) {
          this.categories = res.res.data;
          this.nodes = this.createNode(this.categories);
          this.setDataSource(this.categories);
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

  show(id) {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.show(id).subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        if (!res.status) {
          this.categoryChildren = res.res.data;
          this.asyncChildren = this.createNode(this.categoryChildren);

          this.newNodes = this.asyncChildren.map(c => Object.assign({}, c));
        }
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
}
