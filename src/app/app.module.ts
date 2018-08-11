import { SpinnerService } from './spinner/spinner.service';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import 'hammerjs';
import {SharedModule} from './core/modules/shared.module';
import {AppComponent} from './app.component';
import {FuseFakeDbService} from './fuse-fake-db/fuse-fake-db.service';
import {FuseMainModule} from './main/main.module';
import {FuseSplashScreenService} from './core/services/splash-screen.service';
import {FuseConfigService} from './core/services/config.service';
import {FuseNavigationService} from './core/components/navigation/navigation.service';
import {TranslateModule} from '@ngx-translate/core';
import {AppStoreModule} from './store/store.module';
import { FileDropModule } from 'ngx-file-drop';
import { TreeModule } from 'angular-tree-component';
import { ApiService } from './api/api.service';
import { UsersService } from './api/users.service';
import {SpinnerComponent} from './spinner/spinner.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';


const appRoutes: Routes = [
  {
    path: 'products',
    loadChildren: './main/content/products/products.module#ProductsModule'
  },
  {
    path: 'user-management',
    loadChildren: './main/content/user-management-admin/user-management.module#UserManagementModule'
  },
  {
    path: 'suppliers',
    loadChildren: './main/content/suppliers/suppliers.module#SuppliersModule'
  },
  {
    path: 'apps',
    loadChildren: './main/content/apps/apps.module#FuseAppsModule'
  },
 {
    path: 'pages',
    loadChildren: './main/content/pages/pages.module#FusePagesModule'
  },
  /*
  {
    path: 'ui',
    loadChildren: './main/content/ui/ui.module#FuseUIModule'
  },
  {
    path: 'services',
    loadChildren: './main/content/services/services.module#FuseServicesModule'
  },
  {
    path: 'components',
    loadChildren: './main/content/components/components.module#FuseComponentsModule'
  },
  {
    path: 'components-third-party',
    loadChildren: './main/content/components-third-party/components-third-party.module#FuseComponentsThirdPartyModule'
  },*/
  {
    path: '**',
    redirectTo: 'pages/auth/login'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SharedModule,
    TranslateModule.forRoot(),
    InMemoryWebApiModule.forRoot(FuseFakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    AppStoreModule,
    FuseMainModule,
    FileDropModule,
    TreeModule,
    SnotifyModule
  ],
  providers: [
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    ApiService,
    UsersService,
    SpinnerService,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
