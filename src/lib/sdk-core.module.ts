import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouteGuard} from './guards/route-guard';
import {RouteComponent} from './definitions/route-component';

@NgModule({
  declarations: [
    RouteComponent
  ],
  imports: [
    HttpClientModule
  ],
  providers: [RouteGuard],
  exports: [
    RouteComponent, HttpClientModule
  ]
})
export class SdkCoreModule { }
