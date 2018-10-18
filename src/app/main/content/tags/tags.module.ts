import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { TagsComponent } from "./tags.component";
import { TagComponent } from "./tag.component";
import { TagsService } from "./tags.service";
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "angular-tree-component";
import { AuthGuard } from "../../../guard/auth.guard";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: TagsComponent
  },
  {
    canActivate: [AuthGuard],
    path: "tags",
    component: TagsComponent
  },
  {
    canActivate: [AuthGuard],
    path: "tag/new",
    component: TagComponent
  },
  {
    canActivate: [AuthGuard],
    path: "tag/:id",
    component: TagComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    TreeModule
  ],
  declarations: [TagsComponent, TagComponent],
  providers: [TagsService]
})
export class TagsModule {}
