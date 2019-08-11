export class StorageProvider {
  Set(key, obj) {
    const value = JSON.stringify(obj);
    try {
      localStorage.setItem(key, value);
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

  Remove(key) {
    localStorage.removeItem(key);
  }
}
