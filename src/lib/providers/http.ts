import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {StorageProvider} from './storage';

export class Http {
  constructor(private http: HttpClient, private storage: StorageProvider) {
  }

  Get(url: string, error: (HttpErrorResponse) => {} = null): Observable<any> {
    return this.http.get(url, this.headers())
      .pipe(catchError((response) => { if (error) { error(response); } return this.handleError(response); }));
  }

  Post(url: string, data: any, error: (HttpErrorResponse) => {} = null): Observable<any> {
    return this.http.post(url, data, this.headers())
      .pipe(catchError((response) => { if (error) { error(response); } return this.handleError(response); }));
  }

  Put(url: string, data: any, error: (HttpErrorResponse) => {} = null): Observable<any> {
    return this.http.put(url, data, this.headers())
      .pipe(catchError((response) => { if (error) { error(response); } return this.handleError(response); }));
  }

  Delete(url: string, error: (HttpErrorResponse) => {} = null): Observable<any> {
    return this.http.delete(url, this.headers())
      .pipe(catchError((response) => { if (error) { error(response); } return this.handleError(response); }));
  }

  private headers() {
    const jwt = this.storage.Get('Authorization_Header');
    return jwt ? {
      headers: new HttpHeaders({
        Authorization: jwt
      })
    } : {};
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
