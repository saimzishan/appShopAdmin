import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { FuseAngularMaterialModule } from "../components/angular-material/angular-material.module";
import { CategoriesComponent } from "./categories.component";
import { CategoriesService } from "./categories.service";
import { CategoryComponent } from "./category.component";
import { CategoryService } from "./category.service";
import { TreeModule } from "angular-tree-component";
import { CategoryChildComponent } from "./child/child.component";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { GLOBAL } from "../../../shared/globel";


const routes = [
  {
    path: "",
    component: CategoriesComponent,
    resolve: {
      academy: CategoriesService
    }
  },
  {
    path: ":id",
    component: CategoryComponent,
    resolve: {
      academy: CategoryService
    }
  }
  /*{
    path     : ':id/:handle',
    component: SupplierComponent,
    resolve  : {
      academy: SupplierService
    }
  },*/
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    TreeModule,
    DropzoneModule
  ],
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    CategoryChildComponent
  ],
  providers: [
    CategoriesService,
    CategoryService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG
    }]
})
export class CategoriesModule {}
