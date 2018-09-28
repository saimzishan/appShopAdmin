import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { RolesManagementComponent } from './role-management/roles-management.component';
import { ProductManagmentComponent } from './product-management/product-management.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';
import { UserManagementService } from './users.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';
import { ProductsService } from '../products/products.service';
import { MatTableModule } from '@angular/material';
import { AuthGuard } from '../../../guard/auth.guard';
import { AdminHomeComponent } from './dashboard/home.component';
import { UsersManagementComponent } from './user-management/users-management.component';

const routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: UsersManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-user/users',
    component: UsersManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-user/user/new',
    component: UserManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-user/user/:id',
    component: UserManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-role/roles',
    component: RolesManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-role/role/new',
    component: RoleManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-role/role/:id',
    component: RoleManagementComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-products',
    component: ProductManagmentComponent,
    // resolve  : {
    //   academy: UserManagementService
    // }
  },
  {
    canActivate: [AuthGuard],
    path: 'manage-permissions',
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
    MatTableModule,
  ],
  declarations: [
    UserManagementComponent,
    UsersManagementComponent,
    RoleManagementComponent,
    RolesManagementComponent,
    ProductManagmentComponent,
    PermissionManagementComponent,
    AdminHomeComponent
  ],
  providers: [UserManagementService, ProductsService]
})
export class UserManagementModule {
}
