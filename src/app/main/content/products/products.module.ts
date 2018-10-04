import { OptionAndSkusComponent } from "./option-and-skus/option-and-sku.component";
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
import { CategoriesService } from "../categories/categories.service";
import { SupplierFormComponent } from "./child/supplier.component";
import { VariantComponent } from "./variant/variant.component";
import { DetectChangesService } from "../../../shared/detect-changes.services";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { TageComponent } from "./tage/tage.component";
import { GLOBAL } from "../../../shared/globel";
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: GLOBAL.USER_API + "drop-image",
  maxFilesize: 2, // size MB
  acceptedFiles: "image/png, image/jpeg",
  createImageThumbnails: true,
  clickable: true,
  addRemoveLinks: true
};

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
    path: ":id/:handle",
    component: ProductComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    FileDropModule,
    TreeModule,
    DropzoneModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    FuseOptionFormDialogComponent,
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
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  entryComponents: [FuseOptionFormDialogComponent]
})
export class ProductsModule {}
