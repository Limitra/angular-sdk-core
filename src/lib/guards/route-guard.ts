import {Component, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {SdkProviders} from '../providers';
import {Observable, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class RouteGuard implements CanActivate {
  private api: any;
  private lang: string;
  private errorValid: boolean;

  constructor(private providers: SdkProviders) {
    this.api = this.providers.Storage.Get('API_Settings');
    this.api.Route = this.api.Route || {};
    this.api.Route.KeyField = this.api.Route.KeyField || 'Key';
    this.api.Route.PathField = this.api.Route.PathField || 'Path';
    this.api.Route.LangField = this.api.Route.LangField || 'Lang';
    this.api.Route.Errors = this.api.Route.Errors || {};
    this.api.Route.Errors.E401 = this.api.Route.Errors.E401 || '401';
    this.api.Route.Errors.E404 = this.api.Route.Errors.E404 || '404';
    this.api.Route.Errors.E500 = this.api.Route.Errors.E500 || '500';
    this.errorValid = this.providers.Router.Get.config.filter(x => x.path === this.api.Route.Errors.E500)[0] ? true : false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.lang = this.providers.Storage.Get('Localization_Lang') || '';
    const currentState = state.url.split(/[?#]/)[0].substring(1, state.url.length);
    if (this.api && this.api.Domain && this.api.Route && this.api.Route.Guard) {
      const params: any = {
        path: '/' + currentState,
        e401: this.api.Route.Errors.E401,
        e404: this.api.Route.Errors.E404
      };
      if (this.lang) { params.lang = this.lang; }
      const urlParams = '?' + this.providers.Url.Serialize(params);
      const target = this.api.Domain + '/' + this.api.Route.Guard + urlParams;
      return this.providers.Http.Get(target).pipe(map((response) => {
        if (response.Data) {
          const key = response.Data[this.api.Route.KeyField];
          const routes = this.providers.Router.Get.config;

          const oldChild = routes.filter(x => x.path === key)[0];
          const currentRoute = routes.filter(x => x.path === currentState)[0];
          if (oldChild) {
            const redirect = routes.filter(x => x.path === '**')[0];
            routes.splice(routes.indexOf(redirect), 1);
            routes.splice(routes.indexOf(currentRoute), 1);
            const newRoute: Route = {
              path: currentState,
              component: oldChild.component
            };
            routes.push(newRoute);
            routes.push(redirect);
            this.providers.Router.Get.resetConfig(routes);

            if ('/' + response.Data[this.api.Route.KeyField] !== response.Data[this.api.Route.PathField]) {
              this.providers.Router.Navigate(response.Data[this.api.Route.PathField]);
            }

            routes.splice(routes.indexOf(newRoute), 1);
            newRoute.canActivate = oldChild.canActivate;
            routes.push(newRoute);
            this.providers.Router.Get.resetConfig(routes);

            if (response.Data[this.api.Route.LangField]) {
              this.providers.Storage.Set('Localization_Lang', response.Data[this.api.Route.LangField]);
            }
            return true;
          } else {
            if (this.api.Route.Errors.E500 && this.errorValid) {
              this.providers.Router.Navigate(this.api.Route.Errors.E500);
            }
            return false;
          }
        } else {
          if (response.Error) {
            this.providers.Router.Navigate(response.Error.Path);
          } else if (this.api.Route.Errors.E500 && this.errorValid) {
            this.providers.Router.Navigate(this.api.Route.Errors.E500);
          }
          return false;
        }
      }), catchError((error: HttpErrorResponse) => {
        if (this.api.Route.Errors.E500 && this.errorValid) {
          this.providers.Router.Navigate(this.api.Route.Errors.E500);
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
