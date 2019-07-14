import {Router} from '@angular/router';

export class RouterProvider {
  constructor(private router: Router) { }

  public Get = this.router;

  Navigate(href: string, obj: any = null) {
    this.router.navigate([href], {queryParams: obj});
  }

  Push(route: any) {
    const param = this.router.config.filter(x => x.path === route.Key)[0];
    if (param) {
      this.router.config.push({path: route.Path, component: param.component});
    }
  }
}
