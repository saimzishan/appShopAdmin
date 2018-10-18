import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../../core/modules/shared.module";
import { UserManagementComponent } from "./user-management/user-management.component";
import { RoleManagementComponent } from "./role-management/role-management.component";
import { RolesManagementComponent } from "./role-management/roles-management.component";
import { ProductManagmentComponent } from "./product-management/product-management.component";
import { PermissionManagementComponent } from "./permission-management/permission-management.component";
import { PermissionsManagementComponent } from "./permission-management/permissions-management.component";
import { UserManagementService } from "./users.service";
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "angular-tree-component";
import { MatTableModule } from "@angular/material";
import { AuthGuard } from "../../../guard/auth.guard";
import { AdminHomeComponent } from "./dashboard/home.component";
import { UsersManagementComponent } from "./user-management/users-management.component";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: UsersManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-user/users",
    component: UsersManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-user/user/new",
    component: UserManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-user/user/:id",
    component: UserManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-role/roles",
    component: RolesManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-role/role/new",
    component: RoleManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-role/role/:id",
    component: RoleManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-permission/permissions",
    component: PermissionsManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-permission/permission/new",
    component: PermissionManagementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "manage-permission/permission/:id",
    component: PermissionManagementComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    TreeModule,
    MatTableModule
  ],
  declarations: [
    UserManagementComponent,
    UsersManagementComponent,
    RoleManagementComponent,
    RolesManagementComponent,
    ProductManagmentComponent,
    PermissionManagementComponent,
    PermissionsManagementComponent,
    AdminHomeComponent
  ],
  providers: [UserManagementService]
})
export class UserManagementModule {}
