import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { FuseAngularMaterialModule } from "../components/angular-material/angular-material.module";
import { BrandsComponent } from "./brands.component";
import { BrandComponent } from "./brand.component";
import { BrandsService } from "./brands.service";
import { BrandService } from "./brand.service";
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "angular-tree-component";

const routes = [
  {
    path: "",
    component: BrandsComponent
  },
  {
    path: ":id",
    component: BrandComponent
  },
  {
    path: ":id/:handle",
    component: BrandComponent
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
  declarations: [BrandsComponent, BrandComponent],
  providers: [BrandsService, BrandService]
})
export class BrandsModule {}
