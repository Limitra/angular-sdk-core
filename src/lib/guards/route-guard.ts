import {Component, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {SdkProviders} from '../providers';
import {Observable, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class RouteGuard implements CanActivate {
  private api: any;
  private lang: string;

  constructor(private providers: SdkProviders) {
    this.api = this.providers.Storage.Get('API_Settings');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.lang = this.providers.Storage.Get('Localization_Lang') || '';
    const currentState = state.url.split(/[?#]/)[0].substring(1, state.url.length);
    if (this.api && this.api.Domain && this.api.Route && this.api.Route.Guard) {
      this.api.Route.ErrorPages = this.api.Route.ErrorPages || {};
      this.api.Route.KeyField = this.api.Route.KeyField || 'Key';
      this.api.Route.PathField = this.api.Route.PathField || 'Path';
      this.api.Route.LangField = this.api.Route.LangField || 'Lang';

      const target = this.api.Domain + ('/' + this.api.Route.Guard
        + '?path=/' + currentState).replace('//', '/') + (this.lang ? '&lang=' + this.lang : '');
      return this.providers.Http.Get(target).pipe(map((response) => {
        if (response.Data) {
          const key = response.Data[this.api.Route.KeyField];
          const routes = this.providers.Router.Get.config;

          const oldChild = routes.filter(x => x.path === key)[0];
          if (oldChild) {
            const redirect = routes.filter(x => x.path === '**')[0];
            const redIndex = routes.indexOf(redirect);
            routes.splice(redIndex, 1);
            routes.push({
              path: currentState,
              component: oldChild.component
            });
            routes.push(redirect);
            this.providers.Router.Get.resetConfig(routes);

            if ('/' + response.Data[this.api.Route.KeyField] !== response.Data[this.api.Route.PathField]) {
              this.providers.Router.Navigate(response.Data[this.api.Route.PathField]);
            }

            if (response.Data[this.api.Route.LangField]) {
              this.providers.Storage.Set('Localization_Lang', response.Data[this.api.Route.LangField]);
            }
            return true;
          } else {
            if (this.api.Route.ErrorPage) {
              this.providers.Router.Navigate(this.api.Route.ErrorPage);
            }
            return false;
          }
        } else {
          if (response.Error) {
            this.providers.Router.Navigate(response.Error.Path);
          } else if (this.api.Route.ErrorPage) {
            this.providers.Router.Navigate(this.api.Route.ErrorPage);
          }
          return false;
        }
      }), catchError((error: HttpErrorResponse) => {
        if (this.api.Route.ErrorPage) {
          this.providers.Router.Navigate(this.api.Route.ErrorPage);
        }
        return of(false);
      }));
    } else {
      return true;
    }
  }
}

@Component({
  template: ''
})
export class RouteComponent { }
