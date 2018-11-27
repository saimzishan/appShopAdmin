import { SpinnerService } from "./spinner/spinner.service";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import "hammerjs";
import { SharedModule } from "./core/modules/shared.module";
import { AppComponent } from "./app.component";
import { FuseMainModule } from "./main/main.module";
import { FuseSplashScreenService } from "./core/services/splash-screen.service";
import { FuseConfigService } from "./core/services/config.service";
import { FuseNavigationService } from "./core/components/navigation/navigation.service";
import { TranslateModule } from "@ngx-translate/core";
import { FileDropModule } from "ngx-file-drop";
import { TreeModule } from "ng2-tree";
import { ApiService } from "./api/api.service";
import { UsersService } from "./api/users.service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SnotifyModule, SnotifyService, ToastDefaults } from "ng-snotify";
import { AuthGuard } from "./guard/auth.guard";
import { JwtModule } from "@auth0/angular-jwt";
import * as $ from "jquery";
import { ModalComponents } from "./models/modal.components";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";

export function tokenGetter() {
  let user: any = localStorage.getItem("currentUser");
  let token;
  if (user) {
    user = JSON.parse(user);
    token = user.access_token;
  }
  return token;
}

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "/pages/auth/login",
    pathMatch: "full"
  },
  {
    canActivate: [AuthGuard],
    path: "dashboard",
    loadChildren: "./main/content/dashboard/dashboard.module#DashboardModule"
  },
  {
    canActivate: [AuthGuard],
    path: "products",
    loadChildren: "./main/content/products/products.module#ProductsModule"
  },
  {
    canActivate: [AuthGuard],
    path: "brands",
    loadChildren: "./main/content/brands/brands.module#BrandsModule"
  },
  {
    canActivate: [AuthGuard],
    path: "user-management",
    loadChildren:
      "./main/content/user-management-admin/user-management.module#UserManagementModule"
  },
  {
    path: "categories",
    loadChildren: "./main/content/categories/categories.module#CategoriesModule"
  },
  {
    canActivate: [AuthGuard],
    path: "suppliers",
    loadChildren: "./main/content/suppliers/suppliers.module#SuppliersModule"
  },
  {
    canActivate: [AuthGuard],
    path: "categories",
    loadChildren: "./main/content/categories/categories.module#CategoriesModule"
  },
  {
    canActivate: [AuthGuard],
    path: "options",
    loadChildren: "./main/content/options/options.module#OptionsModule"
  },
  {
    canActivate: [AuthGuard],
    path: "tax-management",
    loadChildren: "./main/content/taxes/taxes.module#TaxesModule"
  },
  {
    canActivate: [AuthGuard],
    path: "tag-management",
    loadChildren: "./main/content/tags/tags.module#TagsModule"
  },
  {
    path: "order-management",
    loadChildren: "./main/content/orders/orders.module#OrdersModule"
  },
  {
    path: "pages",
    loadChildren: "./main/content/pages/pages.module#FusePagesModule"
  },
  {
    path: "bulkproduct",
    loadChildren: "./main/content/products/bulk-product/bulkproduct.module#BulkProductModule"
  },
  /*
  {
    path: 'components',
    loadChildren: './main/content/components/components.module#FuseComponentsModule'
  },
  {
    path: 'components-third-party',
    loadChildren: './main/content/components-third-party/components-third-party.module#FuseComponentsThirdPartyModule'
  },*/
  {
    path: "**",
    redirectTo: "/pages/auth/login",
    pathMatch: "full"
  }
];

@NgModule({
  declarations: [AppComponent, SpinnerComponent, ModalComponents],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SharedModule,
    TranslateModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:4200"]
      }
    }),
    FuseMainModule,
    FileDropModule,
    TreeModule,
    SnotifyModule,
    MatChipsModule
  ],
  providers: [
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
    ApiService,
    UsersService,
    SpinnerService,
    { provide: "SnotifyToastConfig", useValue: ToastDefaults },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    SnotifyService,
    AuthGuard
  ],
  entryComponents: [ModalComponents],
  bootstrap: [AppComponent]
})
export class AppModule {}
