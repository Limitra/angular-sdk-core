export class UrlProvider {
  Serialize(obj: any): string {
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (Array.isArray(element)) {
          element.forEach(elm => {
            params.append(key, elm);
          });
        } else {
          params.set(key, element);
        }
      }
    }
    return params.toString();
  }
}
