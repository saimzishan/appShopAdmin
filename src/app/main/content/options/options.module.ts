import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { OptionsComponent } from './options.component';
import { OptionComponent } from './option.component';
import { OptionsService } from './options.service';
import { OptionService } from './option.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';
import { MatChipsModule } from '@angular/material/chips';


const routes = [
  {
    path: '',
    component: OptionsComponent,
    resolve: {
      academy: OptionsService
    }
  },
  {
    path: ':id',
    component: OptionComponent,
    resolve: {
      academy: OptionService
    }
  },
  {
    path: ':id/:handle',
    component: OptionComponent,
    resolve: {
      academy: OptionService
    }
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    FileDropModule,
    TreeModule,
    MatChipsModule
  ],
  declarations: [OptionsComponent, OptionComponent],
  providers: [OptionsService, OptionService]
})
export class OptionsModule {
}
