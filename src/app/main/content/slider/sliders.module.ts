import { NgModule } from "@angular/core";
import { SharedModule } from "../../../core/modules/shared.module";
import { RouterModule } from "@angular/router";
import { SlidersComponent } from "./sliders.component";
import { SliderComponent } from "./slider.component";
import { SlidersService } from "./sliders.service";
import { SliderService } from "./slider.service";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { AuthGuard } from "../../../guard/auth.guard";
import { GLOBAL } from "../../../shared/globel";

const routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: SlidersComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'slider/:id',
    component: SliderComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'slider/new',
    component: SliderComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    DropzoneModule
  ],
  declarations: [SlidersComponent, SliderComponent],
  providers: [SlidersService, SliderService,
    {
      provide: DROPZONE_CONFIG,
      useValue: GLOBAL.DEFAULT_DROPZONE_CONFIG_FOR_BRAND,
    }]
})
export class SlidersModule {}
