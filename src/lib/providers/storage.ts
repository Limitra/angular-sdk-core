import { CookieService } from 'ngx-cookie-service';

export class StorageProvider {
  constructor(private cookie: CookieService) {}

  Set(key, obj, subKey = null) {
    let assign = this.Get(key);
    assign = subKey ? (assign && typeof(assign) === 'object' ? assign : {}) : assign;
    const value = typeof(obj) === 'object' && obj ? JSON.stringify(obj) : obj;
    if (subKey && assign) {
      assign[subKey] = value;
      assign = JSON.stringify(assign);
    } else {
      assign = value;
    }

    try {
      if (assign) {
        this.cookie.set(key, assign, 365, '/', window.location.hostname, false, 'Strict');
      } else {
        this.Remove(key);
      }
    } catch (e) { }
  }

  Get(key, subKey = null) {
    try {
      const item = this.cookie.get(key);
      if (item) {
        const obj = JSON.parse(item);
        if (subKey && obj) {
          let gVal = null;
          try {
            gVal = JSON.parse(obj[subKey]);
          } catch (e) { }
          gVal = gVal || obj[subKey];
          return gVal;
        } else {
          return obj;
        }
      }
      return item;
    } catch (e) { }
  }

  Remove(key, subKey = null) {
    if (subKey) {
      this.Set(key, undefined, subKey);
    } else {
      this.cookie.delete(key);
    }
  }
}
