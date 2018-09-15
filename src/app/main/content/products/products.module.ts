import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { FuseAngularMaterialModule } from "../components/angular-material/angular-material.module";
import { ProductsComponent } from "./products.component";
import { ProductComponent } from "./product.component";
import { ProductsService } from "./products.service";
import { ProductService } from "./product.service";
import { FileDropModule } from "ngx-file-drop";
import { FuseOptionFormDialogComponent } from "./sku-form/option-form.component";
// import {FileDropModule} from 'ngx-file-drop';
// import {TreeModule} from 'angular-tree-component';
import { AuthGuard } from "../../../guard/auth.guard";
import { TreeModule } from "angular-tree-component";

// import { TreeviewModule } from "ngx-treeview";

import * as $ from "jquery";
import { CategoriesService } from "../categories/categories.service";
import { SupplierFormComponent } from "./child/supplier.component";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: ProductsComponent,
    resolve: {
      academy: ProductsService
    }
  },
  {
    canActivate: [AuthGuard],
    path: ":id",
    component: ProductComponent,
    resolve: {
      academy: ProductService
    }
  },
  {
    canActivate: [AuthGuard],
    path: ":id/:handle",
    component: ProductComponent,
    resolve: {
      academy: ProductService
    }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    FileDropModule,
    TreeModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    FuseOptionFormDialogComponent,
    SupplierFormComponent
  ],
  providers: [ProductsService, ProductService, CategoriesService],
  entryComponents: [FuseOptionFormDialogComponent]
})
export class ProductsModule {}
