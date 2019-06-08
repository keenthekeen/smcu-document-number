import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, switchMap, map, tap } from 'rxjs/operators';

@Injectable()
export class UserGuard implements CanActivate, CanLoad {
  constructor(
    private afa: AngularFireAuth,
    private router: Router,
    private afd: AngularFireDatabase
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.userExist();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.userExist();
  }

  userExist() {
    return this.afa.authState.pipe(first(), switchMap(authState => {
      if (authState) {
        return this.afd
          .object(`data/users/${authState.uid}/profile`).valueChanges().pipe(
          first(),
          tap(data => {
            this.afd.object(`data/users/${authState.uid}/profile`).set({
              displayName: authState.displayName,
              uid: authState.uid,
              email: authState.email
            });
          }),
          map(_ => true));
      } else {
        this.router.navigate(['/']);
        return of(false);
      }
    }));
  }
}
