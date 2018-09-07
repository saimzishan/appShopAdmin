import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { TagsComponent } from './tags.component';
import { TagComponent } from './tag.component';
import { TagsService } from './tags.service';
import { TagService } from './tag.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';

const routes = [
  {
    path: '',
    component: TagsComponent,
    resolve: {
      academy: TagsService
    }
  },
  {
    path: ':id',
    component: TagComponent,
    resolve: {
      academy: TagService
    }
  },
  {
    path: ':id/:handle',
    component: TagComponent,
    resolve: {
      academy: TagService
    }
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    FileDropModule,
    TreeModule
  ],
  declarations: [TagsComponent, TagComponent],
  providers: [TagsService, TagService]
})
export class TagsModule {
}
