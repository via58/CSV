import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wellmetadata',
  templateUrl: './wellmetadata.component.html',
  styleUrls: ['./wellmetadata.component.scss']
})
export class WellmetadataComponent implements OnInit {
  wellname:string;
  curveList:any;

  constructor() { }

  ngOnInit() {
    this.wellname = "sekar";
    this.curveList = ['SPR',"GRS","GRS"];
    
  }
  title6 = "Well meta data components"
}
