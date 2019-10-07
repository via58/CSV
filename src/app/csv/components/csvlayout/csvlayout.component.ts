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
  csvflag: any;
  curveData: any = [];
  points: any = [];
  curveName: string = "";
  wellCount: Number = 0;
  crossSectionData: string = '';
  SelectedCurveList: any = [];
  trackAndSelectedCurve: any = [];
  ProductTypeList: any = [];
  SVGWidth: any = 0;

  constructor(private getcsvdetails: GetCrossSectionDetailsService) {
  }

  loadDataTag: boolean;

  ngOnInit() {
  }

  ngOnChanges() {

  }
  public getData(dataset: any) {

    this.loadDataTag = true;

    this.Getcsvdetails = JSON.parse(dataset.data)

    const wellnamesGrp = [];
    const uwiGrp = [];
    const wellnumberGrp = [];
    var wellOrder = [];
    const trackOrder = [];
    const curveList = [];
    const lasRaster = [];
    const _trackAndSelectedCurve = [];
    var _productTypeList = [];
    var TrackCount1: number = 0;

    if (dataset.flag == "CREATE") {
      this.wellCount = this.Getcsvdetails.length;
      var _wellcount: any = this.wellCount;
      this.csvflag = dataset.flag;

      this.Getcsvdetails.forEach(function (cs: any, $index) {

        if (cs.wellName == null) {
          wellnamesGrp.push(cs.uwi);
        } else {
          wellnamesGrp.push(cs.wellName);
        }
        //curveList.push(cs.curveList);
        uwiGrp.push(cs.uwi);
        wellnumberGrp.push(cs.uwi);
        trackOrder.push(1);
        TrackCount1 = _wellcount;
        wellOrder.push($index + 1)
        _productTypeList.push(cs.productTypeList);

        if (cs.selectedProductType == null) {
          lasRaster.push(cs.productTypeList[0]);

        } else {
          lasRaster.push(cs.selectedProductType);

        }

        var Curves = Object.keys(cs.curveLists);
        const _selectedCurveList = {};


        for (let i = 0; i < Curves.length; i++) {
          var _curveList = cs.selectedCurve == null ? ["--Select Curve--"] : [];
          cs.curveLists[Curves[i]].forEach(products => {

            _curveList.push(products.name);
          });
          _selectedCurveList[Curves[i]]= _curveList;
        }

        _trackAndSelectedCurve.push({ uwi: cs.uwi, trackOrder: trackOrder, selectedCurve: cs.selectedCurve, productType: lasRaster, curveList: _selectedCurveList })
        curveList.push(_selectedCurveList);



      });
      this.SVGWidth = (TrackCount1 * 250) + (((TrackCount1) * 30));
      this.wellnames = wellnamesGrp;
      this.wellnumber = wellnumberGrp;
      this.UWI = uwiGrp;
      this.wellOrder = wellOrder;
      this.trackCount = trackOrder;
      this.curveList1 = curveList;
      this.lasRasterFlag = lasRaster;
      this.SelectedCurveList = curveList;
      this.trackAndSelectedCurve = _trackAndSelectedCurve;
      this.ProductTypeList = _productTypeList;



    } else if (dataset.flag == "LOAD") {
      this.csvflag = dataset.flag;
      this.wellCount = this.Getcsvdetails.wellCount;

      this.Getcsvdetails.crossSectionDetails.forEach(function (cs: any) {
        
        wellnamesGrp.push(cs.wellName);//
        wellnumberGrp.push(cs.wellNumber);
        uwiGrp.push(cs.uwi);//
        wellOrder.push(cs.wellOrder);
        _productTypeList.push(cs.productTypes);
        trackOrder.push(cs.crossSectionInformations.length);
        TrackCount1 = TrackCount1 + cs.crossSectionInformations.length;
        cs.crossSectionInformations.forEach(function (st: any) {
          curveList.push(st.curveList);//
          lasRaster.push(st.productType);
          //_selectedCurveList.push(st.curveName);
          _trackAndSelectedCurve.push({ uwi: cs.uwi, trackOrder: st.trackOrder, selectedCurve: st.curveName, productType: st.productType, curveList: st.curveList })
        })
      })
      this.SVGWidth = (TrackCount1 * 250) + (((TrackCount1) * 30));
      console.log('SVG Width' + this.SVGWidth)
      this.wellnames = wellnamesGrp;
      this.wellnumber = wellnumberGrp;
      this.UWI = uwiGrp;
      this.wellOrder = wellOrder;
      this.trackCount = trackOrder;
      this.curveList1 = curveList;
      this.lasRasterFlag = lasRaster;
    // this.SelectedCurveList = this.Getcsvdetails.selectedProductList;
      this.trackAndSelectedCurve = _trackAndSelectedCurve;
      this.ProductTypeList = _productTypeList;
    }
  }

}
