export class UrlProvider {
  Serialize(obj: any): string {
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        params.set(key, element);
      }
    }
    return params.toString();
  }
}
