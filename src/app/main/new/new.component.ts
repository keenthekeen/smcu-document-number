import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    private afa: AngularFireAuth
  ) {}

  ngOnInit() {
    this.params$ = this.route.params;
    this.params$.pipe(map(params => params.year)).subscribe(year => {
      this.afd
        .object<any>(`data/years/${year}`)
        .valueChanges()
        .pipe(first())
        .subscribe(yearData => {
          if (yearData) {
            const yearNum = parseInt(year, 10);
            this.afd.object(`data/years/${year}`).set({
              christian_year: yearNum,
              buddhist_year: yearNum + 543
            });
          }
        });
    });
    this.year$ = this.params$.pipe(
      switchMap(params => {
        return this.afd.object(`data/years/${params.year}`).valueChanges();
      })
    );
    this.category$ = this.params$.pipe(
      switchMap(params => {
        return this.afd
          .object(`data/categories/${params.category}`)
          .valueChanges();
      })
    );
    this.divisions$ = this.afd
      .list('data/divisions')
      .valueChanges()
      .pipe(
        map((divisions: any[]) =>
          divisions.filter(division => division.value !== 0)
        )
      );
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      divisionId: new FormControl(1, Validators.required)
    });
  }

  submit() {
    if (this.form.valid) {
      this.form.disable();
      combineLatest(this.year$, this.category$)
        .pipe(first())
        .subscribe(([year, category]) => {
          this.afa.authState.pipe(first()).subscribe(user => {
            this.http
              .post(`${environment.baseUrl}/submit`, {
                name: this.form.value.name,
                divisionId: this.form.value.divisionId,
                year: year.christian_year,
                category: category.value,
                uid: user.uid
              })
              .subscribe(res => {
                if (res.ok) {
                  this.router.navigate(['..'], { relativeTo: this.route });
                }
              });
          });
        });
    }
  }
}
