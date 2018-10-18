import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { TaxesComponent } from "./taxes.component";
import { TaxComponent } from "./tax.component";
import { TaxesService } from "./taxes.service";
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "angular-tree-component";
import { AuthGuard } from "../../../guard/auth.guard";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: TaxesComponent
  },
  {
    canActivate: [AuthGuard],
    path: "taxes",
    component: TaxesComponent
  },
  {
    canActivate: [AuthGuard],
    path: "tax/new",
    component: TaxComponent
  },
  {
    canActivate: [AuthGuard],
    path: "tax/:id",
    component: TaxComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    TreeModule
  ],
  declarations: [TaxesComponent, TaxComponent],
  providers: [TaxesService]
})
export class TaxesModule {}
