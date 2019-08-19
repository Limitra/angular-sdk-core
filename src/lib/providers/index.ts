import {Http} from './http';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageProvider} from './storage';
import {UrlProvider} from './url';
import {StringProvider} from './string';
import {NumberProvider} from './number';
import {ScreenProvider} from './screen';
import {Router} from '@angular/router';
import {RouterProvider} from './router';
import {CookieService} from 'ngx-cookie-service';
import {BindProvider} from './bind';

@Injectable()
export class SdkProviders {
  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {
  }

  Bind = new BindProvider();
  Storage = new StorageProvider(this.cookie);
  Url = new UrlProvider();
  String = new StringProvider();
  Number = new NumberProvider();
  Screen = new ScreenProvider();
  Router = new RouterProvider(this.router);
  Http = new Http(this.http, this.Router, this.Storage);
}
