import { Component, OnInit, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-csvtools',
  templateUrl: './csvtools.component.html',
  styleUrls: ['./csvtools.component.scss']
})
export class CsvtoolsComponent implements OnInit {
  selectedCrossSectionId: any;
  selectedCrossSectionName: any;
  disableSaveButton: any;
  disableLoadButton = "disabled"; //initially button is enabled
  CrossSectionList = [];
  @Input() SelectedCurveList: any;
  @Output() LoadCross = new EventEmitter();
  constructor(private crossSectionDetails: GetcrosssectionsService) { }

  ngOnInit() {
    this.createCrossSection();
    const main = document.querySelectorAll('.maingroup')
    this.disableSaveButton = "";

  }

  enableLoadButton() {
    this.disableLoadButton = "";
  }
  createCrossSection() {
    this.crossSectionDetails.getConfig()
      .subscribe(
        data => this.CrossSectionList = data
      )
    //console.log(this.CrossSectionList)
  }


  LoadCrossSection() {
    if (document.querySelector('input[name=CrossSection]:checked') != null) {

      this.selectedCrossSectionId = d3.select('input[name=CrossSection]:checked').property('value');
      this.selectedCrossSectionName = d3.select('input[name=CrossSection]:checked').attr('title');
      this.crossSectionDetails.getCrossSectionData(this.selectedCrossSectionId).subscribe(
        data => {
          if (data) {
            d3.select('.panel-heading').attr('class', ' panel-heading collapsed')
            d3.select('#bar').attr('class', 'collapse');
            d3.select('svg').remove();
            var dataSet = {
              data: JSON.stringify(data),
              flag: "LOAD"
            }
            this.disableSaveButton = "";
            this.LoadCross.emit(dataSet);

          }
        }
      )

    }
    console.log("Selected CrossSection " + this.selectedCrossSectionName)
  }
  SaveCrossSection() {

    // const main = d3.selectAll('.maingroup');
    const main = document.querySelectorAll('.maingroup');


    var _crossSectionDetails = [];

    for (let i = 0; i < main.length; i++) {
      const mainGroup = main[i].classList[1];
      var uniqGroup = document.querySelectorAll(`.${mainGroup}  .uniq`);
      var _crossSectionInformation = [];
      var _wellName = d3.select(`.${mainGroup}`).attr('data-wellName');
      var _wellNumber = d3.select(`.${mainGroup}`).attr('data-wellNumber');
      var _uwi = d3.select(`.${mainGroup}`).attr('data-uwi');
      for (let j = 0; j < uniqGroup.length; j++) {
        const track = uniqGroup[j].classList[1];
        var _trackOrder = j + 1;
        var _productType = d3.select(`.${track} foreignObject .well-info-product select`).property('value');
        var _curveName = "";
        var _curveColor = _productType !== "SMART_RASTER" ? d3.select(`.${track} .chartGrp`).attr('data-curveColor') : null;
        var _curveThickness = 0;
        var _curveScale = 0;
        var _curveList = [];
        var segmentNumber = 0;

        if (_productType == "SMART_RASTER") {
          var _selectedIndex = d3.select(`.${track} .rasterdropdown`).property("selectedIndex");
          var _segmentSelectedIndex = d3.select(`.${track} .rastersegment`).property("selectedIndex");
          var options = document.querySelectorAll(`.${track} .rasterdropdown option`);
          options.forEach(element => {
            _curveList.push(element.textContent)
          })
          _curveName = _curveList[_selectedIndex];
          segmentNumber = parseInt(_segmentSelectedIndex) + 1;
        } else {
          var _selectedIndex = d3.select(`.${track} .lasdropdown`).property("selectedIndex");
          var options = document.querySelectorAll(`.${track} .lasdropdown option`);
          options.forEach(element => {
            _curveList.push(element.textContent)
          })
          _curveName = _curveList[_selectedIndex];
          segmentNumber = null;
        }

        _crossSectionInformation.push({
          "trackOrder": _trackOrder,
          "productType": _productType,
          "curveName": _curveName,
          "curveColor": _curveColor,
          "curveThickness": _productType == "SMART_RASTER" ? 0 : 1,
          "curveScale": null,
          "curveList": _curveList,
          "segmentNumber": segmentNumber,
        })
      }
      _crossSectionDetails.push({
        "crossSectionDetailsId": 0,
        //"crossSectionId": parseInt(this.selectedCrossSectionId == undefined ? 0 : this.selectedCrossSectionId),
        "crossSectionId": 0,
        "uwi": _uwi,
        "wellName": _wellName,
        "wellNumber": _wellNumber,
        "wellOrder": i + 1,
        "crossSectionInformations": _crossSectionInformation
      })

    }


    // var dataObject = {
    //   "crossSectionId": parseInt(this.selectedCrossSectionId == undefined ? parseInt(`10${Math.floor((Math.random() * 10) + 1)}`) : this.selectedCrossSectionId),
    //   "crossSectionName": this.selectedCrossSectionName == undefined ? `crossSection10${Math.floor((Math.random() * 10) + 1)}` : this.selectedCrossSectionName,
    //   "wellCount": main.length,
    //   "crossSectionDetails": _crossSectionDetails
    // } d3.select('#crossSectionName').property('value')
    this.selectedCrossSectionName = d3.select('#crossSectionName').property('value');
    var dataObject = {
      "crossSectionId": 0,
      "crossSectionName": d3.select('#crossSectionName').property('value') == "" ? Date.now().toString() : d3.select('#crossSectionName').property('value'),
      "wellCount": main.length,
      "crossSectionDetails": _crossSectionDetails,
      "selectedProductList": this.SelectedCurveList,

    }

    console.log(dataObject)

    this.crossSectionDetails.saveCrossSection(dataObject)
      .subscribe(
        (response: any) => {
          console.log(response)

        },
        (error: HttpErrorResponse) => {
          console.log();
          if (error.error.text == "Success") {
            $('#openModalSaveCrossSection').click();

          }

        }
      )

    $('#openModalSaveCrossSection').click();
    //localStorage.setItem('savedcs',"true");

  }

  DeleteCrossSection() {
    this.selectedCrossSectionId = d3.select('input[name=CrossSection]:checked').property('value');
    this.crossSectionDetails.DeleteCrossSection(this.selectedCrossSectionId)
      .subscribe(data => {
        //console.log(data);
      });

  }
}
