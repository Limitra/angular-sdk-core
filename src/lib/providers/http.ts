import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {StorageProvider} from './storage';
import {RouterProvider} from './router';
import {DeviceProvider} from './device';

export class Http {
  private localization: any;
  private texts: any;

  constructor(private http: HttpClient, private router: RouterProvider, private storage: StorageProvider,
              private device: DeviceProvider) {
    this.localization = this.storage.Get('Localization_Settings') || {};

    if (this.localization.Language) {
      this.http.get('assets/locale/interface/' + this.localization.Language + '.json').subscribe(response => {
        this.texts = response;
      });
    } else {
      setTimeout(() => {
        this.texts = {
          ErrorClient: 'A client-side or network error occurred.',
          ErrorServer: 'A server-side error occured.'
        };
      });
    }
  }

  Get(url: string, config: any = {}): Observable<any> {
    let headers: any = this.headers();
    if (config.headers) {
      config.headers.forEach(header => {
        (headers.headers as HttpHeaders).append(header.key, header.value)
      });
    }
    delete config.headers;
    headers = {...headers, ...config};

    return this.http.get(url, headers)
      .pipe(catchError((response) => {
        return this.handleError(response, config.error);
      }));
  }

  Post(url: string, data: any, config: any = {}): Observable<any> {
    let headers: any = this.headers();
    if (config.headers) {
      config.headers.forEach(header => {
        (headers.headers as HttpHeaders).append(header.key, header.value)
      });
    }
    delete config.headers;
    headers = {...headers, ...config};

    return this.http.post(url, data, headers)
      .pipe(catchError((response) => {
        return this.handleError(response, config.error);
      }));
  }

  Put(url: string, data: any, config: any = {}): Observable<any> {
    let headers: any = this.headers();
    if (config.headers) {
      config.headers.forEach(header => {
        (headers.headers as HttpHeaders).append(header.key, header.value)
      });
    }
    delete config.headers;
    headers = {...headers, ...config};

    return this.http.put(url, data, headers)
      .pipe(catchError((response) => {
        return this.handleError(response, config.error);
      }));
  }

  Delete(url: string, config: any = {}): Observable<any> {
    let headers: any = this.headers();
    if (config.headers) {
      config.headers.forEach(header => {
        (headers.headers as HttpHeaders).append(header.key, header.value)
      });
    }
    delete config.headers;
    headers = {...headers, ...config};

    return this.http.delete(url, headers)
      .pipe(catchError((response) => {
        return this.handleError(response, config.error);
      }));
  }

  Download(response: any) {
    const header = response.headers.get('content-disposition');
    let filename = header.split('=')[1];
    filename = filename.substring(1, filename.length - 1);
    const extension = filename.split('.')[1].toLowerCase();
    const newBlob = new Blob([response.body], { type: response.body.type });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(() => { window.URL.revokeObjectURL(data); }, 400);
  }

  Initialize() {
    const jwt = this.storage.Get('Authentication_Settings');
    const expire = new Date().getTime();

    if (jwt && jwt.KeepSession && jwt.Expire && jwt.Base && window.location.pathname.startsWith(jwt.Base)) {
      if (jwt.Expire ? jwt.Expire < expire : false) {
        this.handleKick();
      } else {
        this.storage.Set('Authentication_Settings', expire + (((jwt ? jwt.TimeOut : undefined) || 15) * 60 * 1000), 'Expire');
      }
    }
    return this.storage.Get('Authentication_Settings');
  }

  private headers() {
    const jwt = this.Initialize();

    const device = this.device.Get();
    const headers: any = {};
    headers.UserAgent = device.UserAgent;
    headers.OS = device.OS;
    headers.OSVersion = device.OSVersion;
    headers.Browser = device.Browser;
    headers.BrowserVersion = device.BrowserVersion;
    headers.Device = device.Device;
    headers.DeviceType = device.DeviceType;

    if (jwt && jwt.Token) {
      headers.Authorization = jwt.Token;
    }
    if (this.localization.Language) {
      headers.Language = this.localization.Language;
    }
    if (this.localization.TimeZone || this.localization.TimeZone === 0) {
      headers.TimeZone = this.localization.TimeZone.toString();
    }

    return {
      headers: new HttpHeaders(headers)
    };
  }

  private handleError(error: HttpErrorResponse, callback: (HttpErrorResponse) => void) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      if (callback) {
        callback({status: '4**', message: this.texts.ErrorClient, detail: error.error.message});
      }
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (callback) {
        callback({status: error.status || '5**', message: this.texts.ErrorServer, response: error.error});
      }
      if (error.error && error.error.Status === 403) {
        this.handleKick();
      }
    }
    // return an observable with a user-facing error message
    return throwError('');
  }

  private handleKick() {
    const login = this.storage.Get('Authentication_Settings', 'Login');
    this.storage.Set('Authentication_Settings', undefined, 'Token');
    if (login) {
      this.router.Navigate(login);
    } else {
      window.location.reload();
    }
  }
}
