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
  @Output() eventClicked = new EventEmitter<any>();
  @Output() eventClicked_2 = new EventEmitter<any>();

  ngOnInit() {

  }
  printData(){
     console.log(this.pensionForm.value.PensionInformation[0].age);
  } 

  compute(plotDatan: PlotData): void{
    
    var mutex = 1;

    console.log("compute() körs i compute-component")
    var pensionlength = this.pensionForm.value.PensionInformation.length;
    
    var helpdata = [];
    var helpUtbetalningsData = [];

    var plotData = {M: [], V: [], lagtUtfall: [], hogtUtfall: [], time: [], total: undefined};
    var dataUtbetalning = {M: [], hogtUtfall: [], lagtUtfall: [], time: [], total: undefined, salary: []};
    var salaryVector = [];

    var i = 0;
    var j;
  for (i = 0; i < pensionlength; i++){

    helpdata[i] = {M: [], V: [], lagtUtfall: [], hogtUtfall: [], time: [], DT: undefined}

    var informationVector = [];

    informationVector[0] = this.pensionForm.value.PensionInformation[i].age;
    informationVector[1] = this.pensionForm.value.PensionInformation[i].deposit;
    informationVector[2] = this.pensionForm.value.PensionInformation[i].salary;
    informationVector[3] = this.pensionForm.value.PensionInformation[i].pensionAge;
    informationVector[4] = this.pensionForm.value.PensionInformation[i].kapital;
    informationVector[5] = this.pensionForm.value.PensionInformation[i].trad;
    informationVector[6] = this.pensionForm.value.PensionInformation[i].duration;
    informationVector[7] = this.pensionForm.value.PensionInformation[i].risk;
    informationVector[8] = this.pensionForm.value.PensionInformation[i].expReturn;
   
    var lifeExp = 90;

    //Kontrollerar att input är siffror
    for ( j = 0; j < informationVector.length; j++){
      var str = informationVector[j];
      if(!str.match(/^\d*[\.,\,]?\d+$/) && str.length > 0) {
        alert(str+" SOM ÄR IFYLLD ÄR EJ NÅGON SIFFRA!");
        mutex = 0;
      }
      if (informationVector[j] == "") {
            informationVector[j] = 0;
      }
      informationVector[j] = parseFloat(informationVector[j])
    }

    var age = informationVector[0];
    var deposit = informationVector[1];
    var salary = informationVector[2];
    var planedPensionAge = informationVector[3];
    var kapital = informationVector[4];
    var trad = informationVector[5];
    var duration = informationVector[6];
    var risk = informationVector[7];
    var expReturn = informationVector[8];
    salaryVector[i] = salary;

    var data = {M: kapital, V: 0, lagtUtfall: kapital, hogtUtfall: kapital}
    var dep = 0;
    helpdata[i].DT = duration;
    if (trad == ""){
      trad = 0;
      iterateTime(deposit*12,data,helpdata[i],risk,expReturn,age,planedPensionAge,duration,lifeExp);
    }else{
      for(j = 0; j < lifeExp-age; j++){
        helpdata[i].M[j] = 0;
        helpdata[i].hogtUtfall[j] = 0;
        helpdata[i].lagtUtfall[j] = 0;
        helpdata[i].time[j] = age+j;
      }
    }
    trad = parseInt(trad);




    helpUtbetalningsData[i] = {M: [], hogtUtfall: [], lagtUtfall: [], time: []};

    utbetalningPerManad(helpdata[i], helpUtbetalningsData[i], age, planedPensionAge, lifeExp, trad);
   }
    
   salary = Math.max.apply(null,salaryVector)
   //console.log(plotData.hogtUtfall)
   for (j = 0; j < (lifeExp-age); j++){
     plotData.time[j] = age+j;
     plotData.M[j] = 0;
     plotData.hogtUtfall[j] = 0;
     plotData.lagtUtfall[j] = 0;

     dataUtbetalning.time[j] = age+j;
     dataUtbetalning.M[j] = 0;
     dataUtbetalning.hogtUtfall[j] = 0;
     dataUtbetalning.lagtUtfall[j] = 0;

     for (i = 0; i<pensionlength; i++){
       //console.log(i);
       plotData.M[j] = plotData.M[j]+helpdata[i].M[j];
       dataUtbetalning.M[j] = dataUtbetalning.M[j] + helpUtbetalningsData[i].M[j];

       plotData.hogtUtfall[j] = plotData.hogtUtfall[j]+helpdata[i].hogtUtfall[j];
       dataUtbetalning.hogtUtfall[j] = dataUtbetalning.hogtUtfall[j] + helpUtbetalningsData[i].hogtUtfall[j];

       plotData.lagtUtfall[j] = plotData.lagtUtfall[j]+helpdata[i].lagtUtfall[j];
       dataUtbetalning.lagtUtfall[j] = dataUtbetalning.lagtUtfall[j] + helpUtbetalningsData[i].lagtUtfall[j];
     }
   }
   for (j = 0; j < (planedPensionAge-age); j++){
     helpUtbetalningsData[0].M[j] = 0;
     helpUtbetalningsData[0].lagtUtfall[j] = 0;
     helpUtbetalningsData[0].hogtUtfall[j] = 0;
     dataUtbetalning.M[j] = salary;
     dataUtbetalning.hogtUtfall[j] = salary;
     dataUtbetalning.lagtUtfall[j] = salary;
     dataUtbetalning.salary[j] = salary;
   }
    dataUtbetalning.total = helpUtbetalningsData;
    plotData.total = helpdata;
   //console.log(dataUtbetalning)
   if (mutex == 1){
   this.eventClicked.emit(plotData);
   this.eventClicked_2.emit(dataUtbetalning);
   }

  }

}