import { NgModule } from '@angular/core';
import { SharedModule } from '../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';

import { FuseAngularMaterialModule } from '../main/content/components/angular-material/angular-material.module';

import { UserManagmentComponent } from './user-managment.component';
import { UserManagmentService } from './user-managment.service';
// import {ProductComponent} from './product.component';
// import {ProductsService} from './products.service';
// import {ProductService} from './product.service';


const routes = [
    {
        path: '',
        component: UserManagmentComponent,
        resolve: {
            academy: UserManagmentService
        }
    },
    //   {
    //     path     : ':id',
    //     component: ProductComponent,
    //     resolve  : {
    //       academy: ProductService
    //     }
    //   },
    //   {
    //     path     : ':id/:handle',
    //     component: ProductComponent,
    //     resolve  : {
    //       academy: ProductService
    //     }
    //   },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FuseAngularMaterialModule,
        FileDropModule,
        TreeModule
    ],
    declarations: [UserManagmentComponent],
    providers: [UserManagmentService]
})
export class UserManagmentModule {
}
