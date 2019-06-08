import { NoUserGuard } from './no-user.guard';
import { UserGuard } from './user.guard';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    canActivate: [NoUserGuard],
    component: HomeComponent
  },
  {
    path: 'main',
    loadChildren: './main/main.module#MainModule',
    canLoad: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
