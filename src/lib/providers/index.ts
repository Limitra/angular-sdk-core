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
import {DeviceProvider} from './device';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DateProvider} from './date';

@Injectable()
export class SdkProviders {
  constructor(private http: HttpClient, private router: Router, private cookie: CookieService, private device: DeviceDetectorService) {
  }

  Bind = new BindProvider();
  Device = new DeviceProvider(this.device);
  Storage = new StorageProvider(this.cookie);
  Url = new UrlProvider();
  String = new StringProvider();
  Number = new NumberProvider();
  Date = new DateProvider();
  Screen = new ScreenProvider();
  Router = new RouterProvider(this.router);
  Http = new Http(this.http, this.Router, this.Storage, this.String, this.Device);
}
