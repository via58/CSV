import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import {GetCrossSectionDetailsService} from '../../services/get-cross-section-details.service';


@Component({
  selector: 'app-csvlayout',
  templateUrl: './csvlayout.component.html',
  styleUrls: ['./csvlayout.component.scss']
  
})
export class CsvlayoutComponent implements OnInit {
 Getcsvdetails:any;
  UWI: any;
  wellOrder:any;
  trackorder:any;
  wellnames: any;
  wellnumber:any;
  curveList:any;  
  curveData: any = [];
  points: any = [];
  curveName: string = "GRR";
  wellCount: Number = 0;

 
  constructor(private getcsvdetails:GetCrossSectionDetailsService) { 
   }  

  ngOnInit() {
    this.Getcsvdetails = this.getcsvdetails.getConfig();  
    const wellnamesGrp = [];
    const uwiGrp = [];
    const wellnumberGrp = [];
    const wellOrder = [];
    const trackOrder = [];
    this.wellCount = this.Getcsvdetails.wellCount;
    this.Getcsvdetails.crossSectionDetails.forEach(function(cs: any){
      wellnamesGrp.push(cs.wellName);
      wellnumberGrp.push(cs.wellNumber);
      uwiGrp.push(cs.uwi);
      wellOrder.push(cs.wellOrder);
      trackOrder.push(cs.crossSectionInformations.length)
          })
    this.wellnames = wellnamesGrp;
    this.wellnumber = wellnumberGrp;
    this.UWI = uwiGrp;
    this.wellOrder = wellOrder;
    this.trackorder = trackOrder;
   
  
   
  }

  ngOnChanges() {
   
  }
  
}
