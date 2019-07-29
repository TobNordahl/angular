import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PensionInformation, PlotData } from '../pensions';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { linePlot } from '../../asstes/js/custom'

import { Chart, } from 'angular-highcharts';
import { first } from 'rxjs/operators';
import { Options } from 'highcharts';

import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
more(Highcharts);




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
  document.getElementById("plotDiv1").style.padding = "5px";
  var range = [];
  var length = data.total.length
  for (var i = 0; i < data.M.length; i++){
    range[i] = [data.hogtUtfall[i],data.lagtUtfall[i]];
  
  }
  if ( isChecked.checked ){
    this.chart = new Chart({
    title: {
      text: 'Pensionens utveckling över tiden'
    },
    yAxis: {
      title: {
        text: 'Totala Tillgångar (kr)'
      }
    },
    series: [{
      type: 'arearange',
      data: range,
      pointStart: data.time[0],
    },{
      type: 'line',
      data: data.M,
      pointStart: data.time[0],
    }],
    tooltip: {
      followPointer: true,
    }
    })
  }
  else{
      this.chart = new Chart({
      plotOptions:{
        area:{
          stacking: 'normal'
        }
      },
      title: {
      text: 'Pensionens utveckling över tiden'
      },    
      yAxis: {
        title: {
          text: 'Totala Tillgångar (kr)'
        }
      },
      })
      for ( i = 0; i < length; i++){
        this.chart.addSeries({
            type: 'area',
            data: data.total[i].M,
            pointStart: data.time[0],
        },true,true)
      }
  }
}

testPrint_2(data: any) {
   console.log("Nu körs testPrint() från pension-form")
   
  var isChecked = document.getElementById("myCheckbox") as HTMLInputElement; 
  document.getElementById("plotDiv2").style.padding = "5px";
  var range = [];
  var i;
  var length = data.total.length;
  for ( i = 0; i < data.M.length; i++){
    range[i] = [data.hogtUtfall[i],data.lagtUtfall[i]];
  
  }
  if ( isChecked.checked ){
    this.chart_2 = new Chart({
    chart:{
      backgroundColor: '#fff',
    },
    title: {
      text: 'Utbetalningar per månad'
    },
    yAxis: {
      title: {
        text: 'Utbetalning (kr)'
      }
    },
    series: [{
      type: 'arearange',
      data: range,
      pointStart: data.time[0],
    },{
      type: 'line',
      data: data.M,
      pointStart: data.time[0],
    }]
    })
  } else{
      this.chart_2 = new Chart({
      plotOptions:{
        area:{
          stacking: 'normal'
        }
      },
    title: {
      text: 'Utbetalningar per månad'
    },
    yAxis: {
      title: {
        text: 'Utbetalning (kr)'
      }
    },
      })
      this.chart_2.addSeries({
          type: 'area',
          data: data.salary,
          pointStart: data.time[0],
      },true,true)
      for ( i = 0; i < length; i++){
        this.chart_2.addSeries({
            type: 'area',
            data: data.total[i].M,
            pointStart: data.time[0],
        },true,true)
      }
  }
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