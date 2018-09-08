import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { TaxesComponent } from './taxes.component';
import { TaxComponent } from './tax.component';
import { TaxesService } from './taxes.service';
import { TaxService } from './tax.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';

const routes = [
  {
    path: '',
    component: TaxesComponent,
    resolve: {
      academy: TaxesService
    }
  },
  {
    path: ':id',
    component: TaxComponent,
    resolve: {
      academy: TaxService
    }
  },
  {
    path: ':id/:handle',
    component: TaxComponent,
    resolve: {
      academy: TaxService
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
  declarations: [TaxesComponent, TaxComponent],
  providers: [TaxesService, TaxService]
})
export class TaxesModule {
}
