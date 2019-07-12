import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PensionInformation, PlotData } from '../pensions';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { linePlot } from '../../asstes/js/custom'

import { Chart, } from 'angular-highcharts';
import { first } from 'rxjs/operators';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts';




@Component({
  selector: 'app-pension-form',
  templateUrl: './pension-form.component.html',
  styleUrls: ['./pension-form.component.css']
})
export class PensionFormComponent implements OnInit {

  pensionForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  @Input() PensionForm;
  @Output() eventPressed = new EventEmitter<any>();
  highcharts = Highcharts;
  chart: Chart;
  chart_2: Chart;
  
  ngOnInit() {
        this.pensionForm = this.fb.group({
      PensionInformation: this.fb.array([this.fb.group({age:'', salary:'', deposit: '', pensionAge:'', kapital:'', trad:'', duration:'', risk:'', expReturn:''})])
    })
  }
    get pensionPoints() {
    return this.pensionForm.get('PensionInformation') as FormArray;
  }
testPrint(data: any) {
  var isChecked = document.getElementById("myCheckbox") as HTMLInputElement;
  if (isChecked.checked){
    var data1 = data.M;
    var data2 = data.hogtUtfall;
    var data3 = data.lagtUtfall
  }else{
    var data1 = data.M;
    var data2 = data.M;
    var data3 = data.M
  }
   console.log("Nu körs testPrint() från pension-form")
  this.chart = new Chart({
    title: {
      text: 'Pension'
    },

    series: [{
        name: 'Väntad',
        type: 'line',
        data: data1,
        pointStart: data.time[0]
        
    },{
        name: 'Hög',
        type: 'line',
        data: data2,
        pointStart: data.time[0]
    },{ 
        name: 'Låg',
        type: 'line',
        data: data3,
        pointStart: data.time[0]
    }]
  })
}

testPrint_2(data: any) {
   console.log("Nu körs testPrint() från pension-form")
  var isChecked = document.getElementById("myCheckbox") as HTMLInputElement;
  if (isChecked.checked){
    var data1 = data.M;
    var data2 = data.hogtUtfall;
    var data3 = data.lagtUtfall
  }else{
    var data1 = data.M;
    var data2 = data.M;
    var data3 = data.M
  }
  this.chart_2 = new Chart({
    title: {
      text: 'Pension'
    },

    series: [{
        name: 'Väntad',
        type: 'line',
        data: data1,
        pointStart: data.time[0]
        
    },{
        name: 'Hög',
        type: 'line',
        data: data2,
        pointStart: data.time[0]
    },{ 
        name: 'Låg',
        type: 'line',
        data: data3,
        pointStart: data.time[0]
    }]
  })
}


  exportData(){
     console.log(this.pensionForm.value.PensionInformation[0]);
  }

  addPensionPoint(){
    this.pensionPoints.push(this.fb.group({age:'', salary:'', deposit: '',pensionAge:'', kapital:'', trad:'', duration:'', risk:'', expReturn:''}));
  }

  deletePensionPoint(index) {
    this.pensionPoints.removeAt(index);
  }

}