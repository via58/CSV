import { Component, OnInit,Input, AfterViewInit, OnChanges } from '@angular/core';
//import {CsvdataService} from '../../services/csvdata.service';
import * as d3 from 'd3';

import { Subscription } from 'rxjs';
import { ɵngClassDirectiveDef__POST_R3__ } from '@angular/common';
@Component({
  selector: 'app-csvheader',
  templateUrl: './csvheader.component.html',
  styleUrls: ['./csvheader.component.scss']
})
export class CsvheaderComponent implements OnInit {
  wellCount:any  = 0;
  subscription: Subscription;
  constructor(){}//private CsvdataService: CsvdataService) { }
  @Input() wellCount1: Number;
  ngOnInit() {
    
   // this.CsvdataService.setState(2);

  }
  onChooseview($event){    
   const viewSection = $event.srcElement.innerHTML;
   if(viewSection == "MAP"){
     document.getElementById('map-section').style.display = "block";
     document.getElementById('csv-section').style.display = "none";
     d3.select('#mapbtn').attr('class','btn btn-secondary activebtn')
     d3.select('#csvbtn').attr('class','btn btn-secondary ')
   }
   else{
    document.getElementById('map-section').style.display = "none";
    document.getElementById('csv-section').style.display = "block";
    d3.select('#csvbtn').attr('class','btn btn-secondary activebtn')
    d3.select('#mapbtn').attr('class','btn btn-secondary ')

    
   }
  } 
}
