import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TimePipe } from './time.pipe';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [ListComponent, NewComponent, TimePipe]
})
export class MainModule { }
