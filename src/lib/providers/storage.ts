export class StorageProvider {
  Set(key, obj, subKey = null) {
    let assign = this.Get(key, subKey);
    assign = subKey ? (typeof(assign) === 'object' ? assign : {}) : assign;
    const value = JSON.stringify(obj);
    if (subKey && assign) {
      assign[subKey] = value;
      assign = JSON.stringify(assign);
    } else {
      assign = value;
    }

    try {
      if (assign) {
        localStorage.setItem(key, assign);
      } else {
        this.Remove(key);
      }
    } catch (e) { }
  }

  Get(key, subKey = null) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const obj = JSON.parse(item);
        if (subKey && obj) {
          return obj[subKey];
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
      localStorage.removeItem(key);
    }
  }
}
