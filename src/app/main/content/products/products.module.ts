import { OptionAndSkusComponent } from "./option-and-skus/option-and-sku.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { ProductsComponent } from "./products.component";
import { ProductComponent } from "./product.component";
import { ProductsService } from "./products.service";
import { ProductService } from "./product.service";
import { FileDropModule } from "ngx-file-drop";
// import {FileDropModule} from 'ngx-file-drop';
// import {TreeModule} from 'angular-tree-component';
import { AuthGuard } from "../../../guard/auth.guard";
import { TreeModule } from "angular-tree-component";

// import { TreeviewModule } from "ngx-treeview";
import { CategoriesService } from "../categories/categories.service";
import { SupplierFormComponent } from "./child/supplier.component";
import { VariantComponent } from "./variant/variant.component";
import { DetectChangesService } from "../../../shared/detect-changes.services";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { TageComponent } from "./tage/tage.component";
import { GLOBAL } from "../../../shared/globel";
import { TagsService } from "../tags/tags.service";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: ProductsComponent
  },
  {
    canActivate: [AuthGuard],
    path: ":id",
    component: ProductComponent
  },
  {
    canActivate: [AuthGuard],
    path: ":id/:supplier_id",
    component: ProductComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    TreeModule,
    DropzoneModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    SupplierFormComponent,
    OptionAndSkusComponent,
    VariantComponent,
    TageComponent
  ],
  providers: [
    ProductsService,
    ProductService,
    CategoriesService,
    DetectChangesService,
    TagsService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG
    }
  ],
  entryComponents: []
})
export class ProductsModule {}
