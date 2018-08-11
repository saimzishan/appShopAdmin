import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { UserManagmentComponent } from './user-management/user-management.component';
import { RoleManagmentComponent } from './role-management/role-management.component';
import { ProductManagmentComponent } from './product-management/product-management.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';
import { UserManagementService } from './users.service';
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "angular-tree-component";
import {ProductsService} from '../products/products.service';
import { MatSortModule, MatTableModule, MatFormFieldModule, MatButtonModule } from '@angular/material';

const routes = [
  {
    path: '',
    component: UserManagmentComponent,
    // resolve: {
    //   academy: UserManagementService
    // }
  },
  {
    path     : 'manage-users',
    component: UserManagmentComponent,
    // resolve  : {
    //   academy: UserManagementService
    // }
  },
  {
    path     : 'manage-roles',
    component: RoleManagmentComponent,
    // resolve  : {
    //   academy: UserManagementService
    // }
  },
  {
    path     : 'manage-products',
    component: ProductManagmentComponent,
    // resolve  : {
    //   academy: UserManagementService
    // }
  },
  {
    path     : 'manage-permissions',
    component: PermissionManagementComponent,
    // resolve  : {
    //   academy: UserManagementService
    // }
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    FileDropModule,
    TreeModule,
    MatTableModule
  ],
  declarations: [
    UserManagmentComponent,
    RoleManagmentComponent,
    ProductManagmentComponent,
    PermissionManagementComponent
  ],
  providers: [UserManagementService, ProductsService]
})
export class UserManagementModule {
}
