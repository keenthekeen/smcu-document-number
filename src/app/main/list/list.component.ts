import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';

@Component({
  selector: 'smcu-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  params$: ReplaySubject<[string, string]>;
  documents$: Observable<any[]>;
  year$: Observable<any>;
  category$: Observable<any>;

  constructor(private route: ActivatedRoute, private router: Router, private afd: AngularFireDatabase) { }

  ngOnInit() {
    this.params$ = new ReplaySubject<[string, string]>();
    this.route.params.subscribe((params) => {
      if (params.year) {
        if (params.category) {
          this.params$.next([params.year, params.category]);
        } else {
          this.afd.object('/config/allowNormal').first().map((v) => v.$value).subscribe((allowNormal) => {
            if (allowNormal) {
              this.router.navigate(['normal'], { relativeTo: this.route });
            } else {
              this.router.navigate(['special'], { relativeTo: this.route });
            }
          });
        }
      } else {
        this.router.navigate([(new Date()).getFullYear()], { relativeTo: this.route });
      }
    });
    this.params$.map((params) => params[0]).subscribe((year) => {
      this.afd.object(`data/years/${year}`).first().subscribe((yearData) => {
        if (!yearData.$exists()) {
          const yearNum = parseInt(year, 10);
          this.afd.database.ref(`data/years/${year}`).set({
            christian_year: yearNum,
            buddhist_year: yearNum + 543
          });
        }
      })
    })
    this.documents$ = this.params$.switchMap((params) => {
      return this.afd.list(`data/documents/${params[0]}/${params[1]}/documents`, {
        query: {
          orderByChild: 'number'
        }
      }).map((list: any[]) => {
        return list.reverse();
      });
    });
    this.year$ = this.params$.switchMap((params) => {
      return this.afd.object(`data/years/${params[0]}`);
    });
    this.category$ = this.params$.switchMap((params) => {
      return this.afd.object(`data/categories/${params[1]}`);
    });
  }

}
