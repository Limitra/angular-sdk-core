import {Router} from '@angular/router';

export class RouterProvider {
  constructor(private router: Router) { }

  public Get = this.router;

  Navigate(href: string, obj: any = null) {
    this.router.navigate([href], {queryParams: obj});
  }

  Push(route: any) {
    this.router.config.push({path: route.Path, component: route.component});
    this.router.resetConfig(this.router.config);
  }
}
