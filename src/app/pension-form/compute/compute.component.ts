import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';


import {expectedValue, analytic, variance, fractile, iterateTime, utbetalningPerManad} from '../../../asstes/js/custom'

import { PensionInformation, PlotData } from '../../pensions';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

declare var testfunc: any;


@Component({
  selector: 'app-compute',
  templateUrl: './compute.component.html',
  styleUrls: ['./compute.component.css']
})

export class ComputeComponent implements OnInit {

  @Input() pensionForm: FormGroup;
  constructor(private fb: FormBuilder) { }
  @Output() eventClicked = new EventEmitter<PlotData>();

  ngOnInit() {

  }
  printData(){
     console.log(this.pensionForm.value.PensionInformation[0].age);
  } 

  compute(plotData: PlotData): void{
    
    console.log("compute() körs i compute-component")
    var pensionlength = this.pensionForm.value.PensionInformation.length;

    var helpdata = [];

    var plotData = {M: [], V: [], lagtUtfall: [], hogtUtfall: [], time: []}
    

    var i = 0;

    for (i = 0; i < pensionlength; i++){

    helpdata[i] = {M: [], V: [], lagtUtfall: [], hogtUtfall: [], time: [], DT: undefined}

    var age = parseFloat(this.pensionForm.value.PensionInformation[i].age);
    var salary = parseFloat(this.pensionForm.value.PensionInformation[i].salary);
    var planedPensionAge = parseFloat(this.pensionForm.value.PensionInformation[i].pensionAge);
    var kapital = parseFloat(this.pensionForm.value.PensionInformation[i].kapital);
    var trad = parseFloat(this.pensionForm.value.PensionInformation[i].trad);
    var duration = parseFloat(this.pensionForm.value.PensionInformation[i].duration);
    var risk = parseFloat(this.pensionForm.value.PensionInformation[i].risk);
    var expReturn = parseFloat(this.pensionForm.value.PensionInformation[i].expReturn); 
    var lifeExp = 90;
    var j;
    var data = {M: kapital, V: 0, lagtUtfall: kapital, hogtUtfall: kapital}
    var dep = 0;

    helpdata[i].DT = duration;

    iterateTime(salary,data,helpdata[i],risk,expReturn,age,planedPensionAge,duration,lifeExp)
   }
   //console.log(plotData.hogtUtfall)
   for (j = 0; j < (lifeExp-age); j++){
     plotData.time[j] = age+j;
     plotData.M[j] = 0;
     plotData.hogtUtfall[j] = 0;
     plotData.lagtUtfall[j] = 0;
     for (i = 0; i<pensionlength; i++){
       //console.log(i);
       plotData.M[j] = plotData.M[j]+helpdata[i].M[j];

       plotData.hogtUtfall[j] = plotData.hogtUtfall[j]+helpdata[i].hogtUtfall[j];

       plotData.lagtUtfall[j] = plotData.lagtUtfall[j]+helpdata[i].lagtUtfall[j];
     }
   }
   var dataUtbetalning = {M: [], hogtUtfall: [], lagtUtfall: []};
   utbetalningPerManad(helpdata, dataUtbetalning, age, planedPensionAge, lifeExp, pensionlength)
   console.log(dataUtbetalning)
   this.eventClicked.emit(plotData);

  }

}