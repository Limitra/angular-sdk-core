import {Injectable} from '@angular/core';
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
    this.lang = this.providers.Storage.Get('Localization_Settings', 'Language') || '';
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

          const oldChild = routes.filter(x => x.path === key
            || (x.children ? x.children.filter(y => y.path === key).length > 0 : false))[0];
          const currentRoute = routes.filter(x => (x.path === currentState && x.path !== key)
          || (x.children ? x.children.filter(y => y.path === currentState && y.path !== key).length > 0 : false))[0];
          if (oldChild) {
            const children = oldChild.children ? oldChild.children.filter(x => x.path === key)[0] : undefined;
            let redirect: Route;
            if (!oldChild.children) {
              redirect = routes.filter(x => x.path === '**')[0];
              const index = routes.indexOf(redirect);
              if (index > -1) {
                routes.splice(index, 1);
              }
            } else {
              redirect = oldChild.children.filter(x => x.path === '**')[0];
              const index = oldChild.children.indexOf(redirect);
              if (index > -1) {
                oldChild.children.splice(index, 1);
              }
            }
            if (currentRoute) {
              if (!children) {
                routes.splice(routes.indexOf(currentRoute), 1);
              } else {
                const index = currentRoute.children.indexOf(currentRoute.children
                  .filter(x => x.path === currentState && x.path !== key)[0]);
                if (index > -1) {
                  currentRoute.children.splice(index, 1);
                }
              }
            }
            const newRoute: Route = {
              path: currentState
            };
            if (!children) {
              newRoute.component = oldChild.component;
              routes.unshift(newRoute);
              routes.push(redirect);
            } else {
              newRoute.component = children.component;
              oldChild.children.unshift(newRoute);
              oldChild.children.push(redirect);
            }
            this.providers.Router.Get.resetConfig(routes);

            if ('/' + response.Data[this.api.Route.KeyField] !== response.Data[this.api.Route.PathField]) {
              this.providers.Router.Navigate(response.Data[this.api.Route.PathField]);
            }

            if (!children) {
              const index = routes.indexOf(newRoute);
              if (index > -1) {
                routes.splice(index, 1);
              }
              newRoute.canActivate = oldChild.canActivate;
              routes.unshift(newRoute);
            } else {
              const index = oldChild.children.indexOf(newRoute);
              if (index > -1) {
                oldChild.children.splice(index, 1);
              }
              newRoute.canActivate = children.canActivate;
              oldChild.children.unshift(newRoute);
            }

            this.providers.Router.Get.resetConfig(routes);

            if (response.Data[this.api.Route.LangField]) {
              this.providers.Storage.Set('Localization_Settings', response.Data[this.api.Route.LangField], 'Language');
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
