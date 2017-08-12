import { AuthService } from './../core/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smcu-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login();
  }

}
