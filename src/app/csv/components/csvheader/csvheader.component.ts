import { Component, OnInit,Input, AfterViewInit, OnChanges } from '@angular/core';
//import {CsvdataService} from '../../services/csvdata.service';

import { Subscription } from 'rxjs';
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

}
