import {Router} from '@angular/router';

export class RouterProvider {
  constructor(private router: Router) { }

  public Get = this.router;

  Navigate(href: string, obj: any = null) {
    this.router.navigate([href], {queryParams: obj});
  }
}
