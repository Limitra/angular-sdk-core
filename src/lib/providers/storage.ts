export class StorageProvider {
  Set(key, obj) {
    const value = JSON.stringify(obj);
    try {
      localStorage.setItem(key, value);
    } catch (e) { }
  }

  Get(key) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return item;
    } catch (e) { }
  }

  Remove(key) {
    localStorage.removeItem(key);
  }
}
