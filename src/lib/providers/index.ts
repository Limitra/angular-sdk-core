import {Http} from './http';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {StorageProvider} from './storage';
import {UrlProvider} from './url';
import {StringProvider} from './string';

@Injectable()
export class SdkProviders {
  constructor(@Inject(HttpClient) public http: HttpClient) {}

  Storage = new StorageProvider();
  Http = new Http(this.http, this.Storage);
  Url = new UrlProvider();
  String = new StringProvider();
}
