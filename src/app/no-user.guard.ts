import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

@Injectable()
export class NoUserGuard implements CanActivate, CanLoad {

  constructor(private afa: AngularFireAuth, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userExist();
  }

  canLoad(
    route: Route
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userExist();
  }

  userExist() {
    return this.afa.authState.first().map((authState) => {
      if (!authState) {
        return true;
      } else {
        this.router.navigate(['/', 'main']);
        return false;
      }
    });
  }
}
