import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseAngularMaterialModule } from '../components/angular-material/angular-material.module';
import { OrdersService } from './orders.service';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';
import { AuthGuard } from '../../../guard/auth.guard';
import { OrdersComponent } from './orders.component';
import { OrderComponent } from './order.component';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';

const routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: OrdersComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'orders',
    component: OrdersComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'order/new',
    component: OrderComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'order/:id',
    component: OrderComponent,
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
  declarations: [OrdersComponent, OrderComponent, CdkDetailRowDirective],
  providers: [OrdersService]
})
export class OrdersModule {
}
