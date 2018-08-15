import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import {CategoriesComponent} from './categories.component';
import {CategoriesService} from './categories.service';
import {CategoryComponent} from './category.component';
import {CategoryService} from './category.service';
import {TreeModule} from 'angular-tree-component';

const routes = [
  {
    path     : '',
    component: CategoriesComponent,
    resolve  : {
      academy: CategoriesService
    }
  },
  {
    path     : ':id',
    component: CategoryComponent,
    resolve  : {
      academy: CategoryService
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
  imports     : [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    TreeModule
  ],
  declarations: [CategoriesComponent, CategoryComponent],
  providers: [CategoriesService, CategoryService]
})
export class CategoriesModule
{
}
