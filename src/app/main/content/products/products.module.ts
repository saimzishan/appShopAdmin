import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './product.component';
import { ProductsService } from './products.service';
import { ProductService } from './product.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';
import { FuseOptionFormDialogComponent } from './sku-form/option-form.component';
// import {FileDropModule} from 'ngx-file-drop';
// import {TreeModule} from 'angular-tree-component';
import { AuthGuard } from '../../../guard/auth.guard';
import * as $ from 'jquery';


const routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: ProductsComponent,
    resolve: {
      academy: ProductsService
    }
  },
  {
    canActivate: [AuthGuard],
    path: ':id',
    component: ProductComponent,
    resolve: {
      academy: ProductService
    }
  },
  {
    canActivate: [AuthGuard],
    path: ':id/:handle',
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
  declarations: [ProductsComponent, ProductComponent , FuseOptionFormDialogComponent],
  providers: [ProductsService, ProductService],
  entryComponents: [FuseOptionFormDialogComponent]

})
export class ProductsModule {}
