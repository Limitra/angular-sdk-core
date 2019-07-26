import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {StorageProvider} from './storage';

export class Http {
  private texts: any;
  constructor(private http: HttpClient, private storage: StorageProvider) {
   const lang = this.storage.Get('Localization_Lang');

    if (lang) {
      this.http.get('assets/limitra/interface.' + lang + '.json').subscribe(response => {
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

  Get(url: string, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.http.get(url, this.headers())
        .pipe(catchError((response) => { return this.handleError(response, error); }));
  }

  Post(url: string, data: any, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.http.post(url, data, this.headers())
        .pipe(catchError((response) => { return this.handleError(response, error); }));
  }

  Put(url: string, data: any, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.http.put(url, data, this.headers())
        .pipe(catchError((response) => { return this.handleError(response, error); }));
  }

  Delete(url: string, error: (HttpErrorResponse) => void = null): Observable<any> {
    return this.http.delete(url, this.headers())
      .pipe(catchError((response) => { return this.handleError(response, error); }));
  }

  private headers() {
    const jwt = this.storage.Get('Authorization_Header');
    return jwt ? {
      headers: new HttpHeaders({
        Authorization: jwt
      })
    } : {};
  }

  private handleError(error: HttpErrorResponse, callback: (HttpErrorResponse) => void) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      if (callback) {
        callback({ status: '4**', message: this.texts.ErrorClient, detail: error.error.message })
      }
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (callback) {
        callback({ status: error.status || '5**', message: this.texts.ErrorServer, response: error.error });
      }
    }
    // return an observable with a user-facing error message
    return throwError('');
  }
}
