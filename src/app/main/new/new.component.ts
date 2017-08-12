import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/combineLatest';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';

declare var $: any;

@Component({
  selector: 'smcu-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  params$: Observable<any>;
  year$: Observable<any>;
  category$: Observable<any>;
  divisions$: Observable<any[]>;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afd: AngularFireDatabase,
    private http: Http,
    private afa: AngularFireAuth) { }

  ngOnInit() {
    this.params$ = this.route.params;
    this.params$.map((params) => params.year).subscribe((year) => {
      this.afd.object(`data/years/${year}`).first().subscribe((yearData) => {
        if (!yearData.$exists()) {
          const yearNum = parseInt(year, 10);
          this.afd.database.ref(`data/years/${year}`).set({
            christian_year: yearNum,
            buddhist_year: yearNum + 543
          });
        }
      })
    });
    this.year$ = this.params$.switchMap((params) => {
      return this.afd.object(`data/years/${params.year}`);
    });
    this.category$ = this.params$.switchMap((params) => {
      return this.afd.object(`data/categories/${params.category}`);
    });
    this.divisions$ = this.afd.list('data/divisions').map((divisions: any[]) => divisions.filter((division) => division.value !== 0));
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      divisionId: new FormControl(1, Validators.required)
    });
  }

  submit() {
    if (this.form.valid) {
      this.form.disable();
      Observable.combineLatest(this.year$, this.category$).first().subscribe(([year, category]) => {
        this.afa.authState.first().subscribe((user) => {
          this.http.post(`${environment.baseUrl}/submit`, {
            name: this.form.value.name,
            divisionId: this.form.value.divisionId,
            year: year.christian_year,
            category: category.value,
            uid: user.uid
          }).subscribe((res) => {
            if (res.ok) {
              this.router.navigate(['..'], { relativeTo: this.route });
            }
          });
        });
      });
    }
  }

}
