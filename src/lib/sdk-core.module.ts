import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouteComponent} from './guards/route-guard';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [
    RouteComponent
  ],
  exports: [

  ]
})
export class SdkCoreModule {
}
