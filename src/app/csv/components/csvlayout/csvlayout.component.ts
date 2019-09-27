import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { GetCrossSectionDetailsService } from '../../services/get-cross-section-details.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-csvlayout',
  templateUrl: './csvlayout.component.html',
  styleUrls: ['./csvlayout.component.scss']

})
export class CsvlayoutComponent implements OnInit {
  Getcsvdetails: any;
  UWI: any;
  wellOrder: any;
  trackCount: any;
  wellnames: any;
  wellnumber: any;
  curveList1: any;
  lasRasterFlag: any;
  curveData: any = [];
  points: any = [];
  curveName: string = "GRR";
  wellCount: Number = 0;
  crossSectionData: string = '';
  SelectedCurveList: any = [];
  trackAndSelectedCurve: any = [];
  SVGWidth:any=0;

  constructor(private getcsvdetails: GetCrossSectionDetailsService) {
  }

  loadDataTag: boolean;

  ngOnInit() {
  }

  ngOnChanges() {

  }
  getData(data: any) {

    //    this.loadDataTag = false;
    this.loadDataTag = true;

    this.Getcsvdetails = JSON.parse(data)

    const wellnamesGrp = [];
    const uwiGrp = [];
    const wellnumberGrp = [];
    const wellOrder = [];
    const trackOrder = [];
    const curveList = [];
    const lasRaster = [];
    const _selectedCurveList = [];
    const _trackAndSelectedCurve = [];
    var TrackCount1 = 0;


    this.wellCount = this.Getcsvdetails.wellCount;

    this.Getcsvdetails.crossSectionDetails.forEach(function (cs: any) {
      wellnamesGrp.push(cs.wellName);
      wellnumberGrp.push(cs.wellNumber);
      uwiGrp.push(cs.uwi);
      wellOrder.push(cs.wellOrder);
      trackOrder.push(cs.crossSectionInformations.length);
      TrackCount1 = TrackCount1 + cs.crossSectionInformations.length;
      cs.crossSectionInformations.forEach(function (st: any) {
        curveList.push(st.curveList);
        lasRaster.push(st.productType);
        _selectedCurveList.push(st.curveName);
        _trackAndSelectedCurve.push({ uwi: cs.uwi, trackOrder: st.trackOrder, selectedCurve: st.curveName, productType: st.productType, curveList: st.curveList })
      })
    })
    this.SVGWidth=(TrackCount1*250)+(((TrackCount1)*30));
    console.log('SVG Width' + this.SVGWidth)
    this.wellnames = wellnamesGrp;
    this.wellnumber = wellnumberGrp;
    this.UWI = uwiGrp;
    this.wellOrder = wellOrder;
    this.trackCount = trackOrder;
    this.curveList1 = curveList;
    this.lasRasterFlag = lasRaster;
    this.SelectedCurveList = _selectedCurveList;
    this.trackAndSelectedCurve = _trackAndSelectedCurve;

  }

}
