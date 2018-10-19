import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { CategoriesComponent } from "./categories.component";
import { CategoriesService } from "./categories.service";
import { CategoryComponent } from "./category.component";
import { CategoryService } from "./category.service";
import { TreeModule } from "angular-tree-component";
import { CategoryChildComponent } from "./child/child.component";
import { AuthGuard } from "../../../guard/auth.guard";

const routes = [
  {
    canActivate:[AuthGuard],
    path: "",
    component: CategoriesComponent
  },
  {
    canActivate:[AuthGuard],
    path: ":id",
    component: CategoryComponent,
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), TreeModule],
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    CategoryChildComponent
  ],
  providers: [CategoriesService, CategoryService]
})
export class CategoriesModule {}
