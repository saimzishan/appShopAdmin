import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../core/modules/shared.module";

import { FuseMainComponent } from "./main.component";
import { FuseContentComponent } from "./content/content.component";
import { FuseFooterComponent } from "./footer/footer.component";
import { FuseNavbarVerticalComponent } from "./navbar/vertical/navbar-vertical.component";
import { FuseToolbarComponent } from "./toolbar/toolbar.component";
import { FuseNavigationModule } from "../core/components/navigation/navigation.module";
import { FuseNavbarVerticalToggleDirective } from "./navbar/vertical/navbar-vertical-toggle.directive";
import { FuseNavbarHorizontalComponent } from "./navbar/horizontal/navbar-horizontal.component";

@NgModule({
  declarations: [
    FuseContentComponent,
    FuseFooterComponent,
    FuseMainComponent,
    FuseNavbarVerticalComponent,
    FuseNavbarHorizontalComponent,
    FuseToolbarComponent,
    FuseNavbarVerticalToggleDirective
  ],
  imports: [SharedModule, RouterModule, FuseNavigationModule],
  exports: [FuseMainComponent]
})
export class FuseMainModule {}
