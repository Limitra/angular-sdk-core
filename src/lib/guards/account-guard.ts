import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {SdkProviders} from '../providers';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivateChild {
  constructor(private providers: SdkProviders) {
  }

  canActivateChild(): boolean {
    const jwt = this.providers.Storage.Get('Authentication_Settings');
    if (jwt && jwt.Home && jwt.Token) {
      this.providers.Router.Navigate(jwt.Home);
    }
    return jwt && jwt.Token ? false : true;
  }
}
