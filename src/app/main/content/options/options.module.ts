import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { OptionsComponent } from './options.component';
import { OptionComponent } from './option.component';
import { OptionsService } from './options.service';
import { MatChipsModule } from '@angular/material/chips';
import { AuthGuard } from '../../../guard/auth.guard';


const routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: OptionsComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'option/:id',
    component: OptionComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'option/new',
    component: OptionComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FuseAngularMaterialModule,
    MatChipsModule
  ],
  declarations: [OptionsComponent, OptionComponent],
  providers: [OptionsService]
})
export class OptionsModule {
}
