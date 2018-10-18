import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "./material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxDnDModule } from "@swimlane/ngx-dnd";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import {
  FuseMatSidenavHelperDirective,
  FuseMatSidenavTogglerDirective
} from "../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.directive";
import { FuseMatSidenavHelperService } from "../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service";
import { FusePipesModule } from "../pipes/pipes.module";
import { FuseConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { FuseMatchMedia } from "../services/match-media.service";
import { FuseNavbarVerticalService } from "../../main/navbar/vertical/navbar-vertical.service";
import { FusePerfectScrollbarDirective } from "../directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive";
import { FuseIfOnDomDirective } from "../directives/fuse-if-on-dom/fuse-if-on-dom.directive";
import { FuseTranslationLoaderService } from "../services/translation-loader.service";
import { CookieService } from "ngx-cookie-service";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    FuseMatSidenavHelperDirective,
    FuseMatSidenavTogglerDirective,
    FuseConfirmDialogComponent,
    FuseIfOnDomDirective,
    FusePerfectScrollbarDirective
  ],
  imports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    FusePipesModule,
    ReactiveFormsModule,
    ColorPickerModule,
    NgxDnDModule,
    NgxDatatableModule
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    FuseMatSidenavHelperDirective,
    FuseMatSidenavTogglerDirective,
    FusePipesModule,
    FusePerfectScrollbarDirective,
    ReactiveFormsModule,
    ColorPickerModule,
    NgxDnDModule,
    NgxDatatableModule,
    FuseIfOnDomDirective,
    TranslateModule
  ],
  entryComponents: [FuseConfirmDialogComponent],
  providers: [
    CookieService,
    FuseMatchMedia,
    FuseNavbarVerticalService,
    FuseMatSidenavHelperService,
    FuseTranslationLoaderService
  ]
})
export class SharedModule {}
