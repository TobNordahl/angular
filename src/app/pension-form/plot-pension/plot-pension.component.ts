import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { PensionInformation, PlotData } from '../../pensions';

@Component({
  selector: 'app-plot-pension',
  templateUrl: './plot-pension.component.html',
  styleUrls: ['./plot-pension.component.css']
})
export class PlotPensionComponent implements OnInit {
  @Input() data: PlotData;
  constructor() { }

  ngOnInit() {
    console.log( this.data);
    
  }
  
  public plot(data: any) {
   console.log( this.data);
  }
}