import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { SuppliersComponent } from './suppliers.component';
import { SuppliersService } from './suppliers.service';
import { SupplierComponent } from './supplier.component';
import { SupplierService } from './supplier.service';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { GLOBAL } from "../../../shared/globel";
import { AuthGuard } from '../../../guard/auth.guard';

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: SuppliersComponent,
  },
  {
    canActivate: [AuthGuard],
    path: ":id",
    component: SupplierComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    DropzoneModule
  ],
  declarations: [SuppliersComponent, SupplierComponent],
  providers: [
    SuppliersService,
    SupplierService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class SuppliersModule {}
