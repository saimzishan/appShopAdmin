import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { GLOBAL } from "../../../shared/globel";
import { AuthGuard } from '../../../guard/auth.guard';
import { ProductClassComponent } from './product-class.component';
import { ProductClassService } from './product-class.service';

const routes = [
  {
    canActivate: [AuthGuard],
    path: "slider",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "featured",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "on-sale",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "new-arrival",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "promoted",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "add-on",
    component: ProductClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: "banner",
    component: ProductClassComponent,
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    DropzoneModule
  ],
  declarations: [ProductClassComponent],
  providers: [
    ProductClassService,
  ]
})
export class ProductClassModule {}
