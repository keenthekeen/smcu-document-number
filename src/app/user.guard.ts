import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class UserGuard implements CanActivate, CanLoad {

  constructor(private afa: AngularFireAuth, private router: Router, private afd: AngularFireDatabase) { }

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
    return this.afa.authState.first().switchMap((authState) => {
      if (authState) {
        return this.afd.object(`data/users/${authState.uid}/profile`).first().map((data) => {
          if (!data.$exists()) {
            this.afd.database.ref(`data/users/${authState.uid}/profile`).set({
              displayName: authState.displayName,
              uid: authState.uid,
              email: authState.email
            });
          }
          return true;
        });
      } else {
        this.router.navigate(['/']);
        return Observable.of(false);
      }
    });
  }
}
