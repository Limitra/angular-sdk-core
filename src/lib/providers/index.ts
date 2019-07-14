import {Http} from './http';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {StorageProvider} from './storage';
import {UrlProvider} from './url';
import {StringProvider} from './string';
import {NumberProvider} from './number';
import {ScreenProvider} from './screen';
import {Router} from '@angular/router';
import {RouterProvider} from './router';

@Injectable()
export class SdkProviders {
  constructor(@Inject(HttpClient) protected http: HttpClient,
              @Inject(Router) protected router: Router) {}

  Storage = new StorageProvider();
  Http = new Http(this.http, this.Storage);
  Url = new UrlProvider();
  String = new StringProvider();
  Number = new NumberProvider();
  Screen = new ScreenProvider();
  Router = new RouterProvider(this.router);
}
