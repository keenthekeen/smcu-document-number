import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'smcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  burgerStatus = false;
  user$: Observable<firebase.User>;

  constructor(private auth: AuthService, private afa: AngularFireAuth) {}

  ngOnInit() {
    this.user$ = this.afa.authState;
  }

  toggleBurger() {
    this.burgerStatus = !this.burgerStatus;
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
