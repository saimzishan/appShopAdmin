import { BulkProductComponent } from "./bulkproduct.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { FileDropModule } from "ngx-file-drop";
// import {FileDropModule} from 'ngx-file-drop';
// import {TreeModule} from 'angular-tree-component';
import { AuthGuard } from "../../../../guard/auth.guard";
import { TreeModule } from "angular-tree-component";

// import { TreeviewModule } from "ngx-treeview";
import { DetectChangesService } from "../../../../shared/detect-changes.services";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { GLOBAL } from "../../../../shared/globel";
import { BulkProductService } from "./bulkproduct.service";

const routes = [
  {
    canActivate: [AuthGuard],
    path: "",
    component: BulkProductComponent
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FileDropModule,
    TreeModule,
    DropzoneModule
  ],
  declarations: [
    BulkProductComponent,
  ],
  providers: [
    BulkProductService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG
    }
  ],
  entryComponents: []
})
export class BulkProductModule {}
