import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { OrdersService } from "./orders.service";
import { FileDropModule } from "ngx-file-drop";
import { ClipboardModule } from "ngx-clipboard";
import { TreeModule } from "angular-tree-component";
import { AuthGuard } from "../../../guard/auth.guard";
import { OrdersComponent } from "./orders.component";
import { CdkDetailRowDirective } from "./cdk-detail-row.directive";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: OrdersComponent
  },
  {
    canActivate: [AuthGuard],
    path: "orders",
    component: OrdersComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    ClipboardModule,
    TreeModule
  ],
  declarations: [OrdersComponent, CdkDetailRowDirective],
  providers: [OrdersService]
})
export class OrdersModule {}
