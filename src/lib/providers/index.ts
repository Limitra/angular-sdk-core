import {Http} from './http';
import {HttpClient} from '@angular/common/http';
import {Inject} from '@angular/core';
import {StorageProvider} from './storage';
import {UrlProvider} from './url';

export class SdkProviders {
  constructor(@Inject(HttpClient) public http: HttpClient) {}

  Storage = new StorageProvider();
  Http = new Http(this.http, this.Storage);
  Url = new UrlProvider();
}
