import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { SuppliersComponent } from './suppliers.component';
import { SuppliersService } from './suppliers.service';
import { SupplierComponent } from './supplier.component';
import { SupplierService } from './supplier.service';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { GLOBAL } from "../../../shared/globel";

const routes = [
  {
    path: '',
    component: SuppliersComponent,
    resolve: {
      academy: SuppliersService
    }
  },
  {
    path: ':id',
    component: SupplierComponent,
    resolve: {
      academy: SupplierService
    }
  },
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
export class SuppliersModule {
}
