import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { SuppliersComponent } from './suppliers.component';
import { SuppliersService } from './suppliers.service';
import { SupplierComponent } from './supplier.component';
import { SupplierService } from './supplier.service';

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
    MatExpansionModule
  ],
  declarations: [SuppliersComponent, SupplierComponent],
  providers: [SuppliersService, SupplierService]
})
export class SuppliersModule {
}
