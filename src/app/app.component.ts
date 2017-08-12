import { AuthService } from './core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'smcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user$: Observable<firebase.User>;

  constructor(
    private afa: AngularFireAuth,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.user$ = this.afa.authState;
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
