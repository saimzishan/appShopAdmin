import { GLOBAL } from "./../../../shared/globel";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { SnotifyService } from "ng-snotify";
import { SpinnerService } from "./../../../spinner/spinner.service";
import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { CategoryService } from "./category.service";
import { fuseAnimations } from "../../../core/animations";
import { Subscription } from "rxjs/Subscription";
import { Category } from "../models/category.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FuseUtils } from "../../../core/fuseUtils";
import { MatSnackBar } from "@angular/material";
import { ITreeOptions } from "angular-tree-component";
import { Supplier } from "../models/supplier.model";
import { CategoriesService } from "./categories.service";
import { Router, NavigationEnd } from "@angular/router";
import { DropzoneDirective } from "ngx-dropzone-wrapper";
import { Image } from '../models/product.model';

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CategoryComponent implements OnInit, OnDestroy {
  config = GLOBAL.DEFAULT_DROPZONE_CONFIG;
  category = new Category();
  supplier = new Supplier();
  images: Image[];
  image: Image;
  lImages: any[] = [];
  onSupplierChanged: Subscription;
  pageType: boolean;
  categoryForm: FormGroup;
  baseURL = GLOBAL.USER_IMAGE_API;

  @ViewChild(DropzoneDirective)
  directiveRef: DropzoneDirective;

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
    private categoriesService: CategoriesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private router: Router,
    protected http: HttpClient
  ) {
    this.images = new Array<Image>();
    this.image = new Image();
  }

  ngOnInit() {
    this.index();
    this.categoryForm = this.createcategoryForm();
  }

  checkPageType(): boolean {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let pageType: any = event.url.split("/");
        if (pageType.length > 2) {
          pageType = pageType[2].toString();
          if (pageType !== "new") {
            this.pageType = false;
          } else {
            this.pageType = true;
          }
        }
      }
    });
    return this.pageType;
  }
  addNode(tree: any) {
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
    this.categoriesService.getCategories().subscribe(
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
      }
    );
  }

  show(id) {
    this.spinnerService.requestInProcess(true);
    this.categoriesService.getCategoryById(id).subscribe(
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

  store() {
    const a = this.directiveRef.dropzone();
    for (const iterator of a.files) {
      this.addPicture(iterator);
    }
    const data = this.categoryForm.getRawValue();
    data["parent_id"] = this.parentCatId;
    data["image"] = this.category.image;
    this.categoryService.store(data).subscribe(
      (res: any) => {
        this.snotifyService.success(res.res.message, "Success !");
        this.spinnerService.requestInProcess(false);
        this.router.navigate(["/categories"]);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  addPicture(obj) {
    this.category.image.base64String = obj.dataURL.split(",")[1];
    this.category.image.content_type = obj.type.split("/")[1];
    this.category.image.content_type = "." + this.category.image.content_type;
    this.category.image.type = "small";
  }

  onUploadError(evt) { }
  onUploadSuccess(evt) { }
  onCanceled(event) { }
  ngOnDestroy() { }
}
