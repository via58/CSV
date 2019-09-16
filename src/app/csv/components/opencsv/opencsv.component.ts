import { Component, OnInit } from '@angular/core';
import {GetcrosssectionsService} from '../../services/getcrosssections.service';

@Component({
  selector: 'app-opencsv',
  templateUrl: './opencsv.component.html',
  styleUrls: ['./opencsv.component.scss']
})
export class OpencsvComponent implements OnInit {

  constructor(private getCSVService:GetcrosssectionsService) { }
  openCSVData:any;
  ngOnInit() {
    this.openCSVData=this.getCSVService.getConfig();
    console.log('csv data', this.openCSVData);
  }
  title4 = "Open CSV";

}
