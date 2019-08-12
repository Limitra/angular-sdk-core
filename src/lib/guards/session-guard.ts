import {Injectable} from '@angular/core';
import { CanActivateChild }  from '@angular/router';
import {SdkProviders} from '../providers';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivateChild {
  constructor(private providers: SdkProviders) {
  }

  canActivateChild(): boolean {
    const jwt = this.providers.Storage.Get('Authentication_Settings');
    if (jwt && jwt.Login && !jwt.Token) {
      this.providers.Router.Navigate(jwt.Login);
    }
    return jwt && jwt.Token ? true : false;
  }
}
