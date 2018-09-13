import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { CategoryService } from "./category.service";
import { fuseAnimations } from "../../../core/animations";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { Subscription } from "rxjs/Subscription";
import { Category } from "../models/category.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FuseUtils } from "../../../core/fuseUtils";
import { MatSnackBar } from "@angular/material";
import { Location } from "@angular/common";
import { ITreeOptions, TreeNode, TreeModel } from "angular-tree-component";
import { Supplier } from "../models/supplier.model";
import { CategoriesService } from "./categories.service";
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CategoryComponent implements OnInit, OnDestroy {
  category = new Category();
  supplier = new Supplier();
  onSupplierChanged: Subscription;
  pageType: string;
  categoryForm: FormGroup;
  private sub: Subscription;

  parentCat;
  model = {};

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
  categoryChildren: any;
  newNodes: (
    | { name: string; hasChildren: boolean }
    | { name: string; hasChildren?: undefined })[];
  categories: any;
  parentCatId: any;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location,
    private categoriesService: CategoriesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.pageType = event.url.split("/")[2].toString();
        if (this.pageType !== "new") {
          this.pageType = "edit";
        }
      }
    });
  }

  ngOnInit() {
    this.index();
    this.categoryForm = this.createcategoryForm();
  }

  addNode(tree: any) {
    // console.log(tree);
    const data = this.categoryForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.nodes[0].children.push({
      name: data.name
    });
    tree.update();
  }

  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    this.parentCatId = treeModel.activeNodes[0].data.my_id;
  }

  onEvent(data) {
    this.parentCat = data.node;
  }

  getChildren(node: any) {
    this.show(node.data.my_id);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.newNodes), 4000);
    });
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

  index() {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.index().subscribe(
      (res: any) => {
        if (!res.status) {
          this.categories = res.res.data;
          this.nodes = this.createNode(this.categories);
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

  createcategoryForm() {
    return this.formBuilder.group({
      id: [this.category.id],
      name: [this.category.name],
      parent_id: [this.category.parent_id],
      parentName: [""]
    });
  }

  saveSupplier() {
    const data = this.categoryForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.categoryService.saveSupplier(data).then(() => {
      // Trigger the subscription with new data
      this.categoryService.onSupplierChanged.next(data);

      // Show the success message
      this.snackBar.open("Supplier saved", "OK", {
        verticalPosition: "top",
        duration: 2000
      });
    });
  }

  store() {
    const data = this.categoryForm.getRawValue();
    if (this.parentCatId === undefined) {
      this.snotifyService.warning("Please select a parent category");
      return;
    }
    data["parent_id"] = this.parentCatId;
    this.spinnerService.requestInProcess(true);

    this.categoryService.store(data).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/categories"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  ngOnDestroy() {
    // this.onSupplierChanged.unsubscribe();
  }
}
