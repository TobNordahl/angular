import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { MatTableModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular-highcharts';


import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TopBarComponent } from './top-bar/top-bar.component';

import { PensionFormComponent } from './pension-form/pension-form.component';
import { ComputeComponent } from './pension-form/compute/compute.component';
import { PlotPensionComponent } from './pension-form/plot-pension/plot-pension.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule,  ReactiveFormsModule, ChartModule],
  declarations: [ AppComponent, HelloComponent, PensionFormComponent, ComputeComponent, PlotPensionComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
