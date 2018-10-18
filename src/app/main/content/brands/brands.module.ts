import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { FuseAngularMaterialModule } from "../components/angular-material/angular-material.module";
import { BrandsComponent } from "./brands.component";
import { BrandComponent } from "./brand.component";
import { BrandsService } from "./brands.service";
import { BrandService } from "./brand.service";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";

const routes = [
  {
    canActivate:[AuthGuard],
    path: '',
    component: BrandsComponent
  },
  {
    canActivate:[AuthGuard],
    path: 'brand/:id',
    component: BrandComponent
  },
  {
    canActivate:[AuthGuard],
    path: 'brand/new',
    component: BrandComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    DropzoneModule
  ],
  declarations: [BrandsComponent, BrandComponent],
  providers: [BrandsService, BrandService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG_FOR_BRAND,
    }]
})
export class BrandsModule {}
