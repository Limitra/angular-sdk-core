/*
 * Public API Surface of sdk-core
 */

import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouteComponent} from './lib/definitions/route-component';
import {SdkProviders} from './lib/providers';
import {HttpClientModule} from '@angular/common/http';

export * from './lib/guards/route-guard';
export * from './lib/definitions/screen-size';
export * from './lib/definitions/route-component';
export * from './lib/providers/index';

@NgModule({
  declarations: [
    RouteComponent
  ],
  imports: [HttpClientModule],
  providers: [],
  exports: [
    RouteComponent
  ]
})
export class SdkCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SdkCoreModule,
      providers: [SdkProviders]
    };
  }
}
