import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, mergeMap} from 'rxjs/operators';
import {Observable, throwError, from} from 'rxjs';
import {StorageProvider} from './storage';
import {RouterProvider} from './router';
import {DeviceProvider} from './device';
import {StringProvider} from './string';

declare let grecaptcha;

export class Http {
  private localization: any;
  private texts: any;

  constructor(private http: HttpClient, private router: RouterProvider, private storage: StorageProvider,
              private str: StringProvider, private device: DeviceProvider) {
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

  File(url: string, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.headers(url).pipe(mergeMap((headers: any) => {
      headers.responseType = 'arraybuffer';
      return this.http.get(url, headers)
        .pipe(catchError((response) => {
          return this.handleError(response, error);
        }));
    }));
  }

  Get(url: string, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.headers(url).pipe(mergeMap((headers: any) => {
      return this.http.get(url, headers)
        .pipe(catchError((response) => {
          return this.handleError(response, error);
        }));
    }));
  }

  Post(url: string, data: any, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.headers(url).pipe(mergeMap((headers: any) => {
      return this.http.post(url, data, headers)
        .pipe(catchError((response) => {
          return this.handleError(response, error);
        }));
    }));
  }

  Put(url: string, data: any, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.headers(url).pipe(mergeMap((headers: any) => {
      return this.http.put(url, data, headers)
        .pipe(catchError((response) => {
          return this.handleError(response, error);
        }));
    }));
  }

  Delete(url: string, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.headers(url).pipe(mergeMap((headers: any) => {
      return this.http.delete(url, headers)
        .pipe(catchError((response) => {
          return this.handleError(response, error);
        }));
    }));
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

  private headers(url: string) {
    const promise = new Promise((resolve, reject) => {
      const jwt = this.Initialize();

      const headers: any = this.device.Get();
      if (jwt && jwt.Token) {
        headers.Authorization = jwt.Token;
      }
      if (this.localization.Language) {
        headers.Language = this.localization.Language;
      }
      if (this.localization.TimeZone || this.localization.TimeZone === 0) {
        headers.TimeZone = this.localization.TimeZone.toString();
      }

      if (jwt && jwt.SecurityKey) {
        let method = url.includes('?') ? url.split('?')[0] : url;
        method = url.includes('&') ? url.split('&')[0] : url;
        method = this.str.Replace(method, '/', '');
        method = this.str.Replace(method, ':', '');
        method = this.str.Replace(method, '.', '');
        method = this.str.Replace(method, '-', '');
        method = this.str.Replace(method, 'http', '');
        method = this.str.Replace(method, 'https', '');
        try {
          grecaptcha.execute(jwt.SecurityKey, { action: method })
            .then((token) => {
              headers.SecurityToken = token;
              resolve({
                headers: new HttpHeaders(headers)
              });
            }, () => {
              if (jwt && jwt.SecurityLocalToken) {
                headers.SecurityToken = jwt.SecurityLocalToken;
              }
              resolve({
                headers: new HttpHeaders(headers)
              });
            });
        } catch {
          resolve({
            headers: new HttpHeaders(headers)
          });
        }
      } else {
        resolve({
          headers: new HttpHeaders(headers)
        });
      }
    });
    return from(promise);
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
