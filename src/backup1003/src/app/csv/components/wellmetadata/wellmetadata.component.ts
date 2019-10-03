import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, ElementRef, Input, ViewEncapsulation, Output } from '@angular/core';
//import 'bootstrap';
import * as $ from 'jquery';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { RasterComponent } from '../raster/raster.component';
import { LasComponent } from '../las/las.component';
import { CsvloaderComponent } from '../csvloader/csvloader.component'



@Component({
  selector: 'app-wellmetadata',
  templateUrl: './wellmetadata.component.html',
  styleUrls: ['./wellmetadata.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WellmetadataComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  @ViewChild(RasterComponent, { static: true }) rastercomp;
  @ViewChild(LasComponent, { static: true }) lascomp;
  @ViewChild(CsvloaderComponent, { static: true }) loadercomp;

  @Input() wellCount2: Number;
  @Input() wellinfo: any;
  @Input() wellnumber: any;
  @Input() UWI: any;
  @Input() wellOrder: any;
  @Input() trackCount: any;
  @Input() curveListData: any;
  @Input() lasRasterFlag: any;
  @Input() SelectedCurveList: any;
  @Input() trackAndSelectedCurve: any;
  @Input() SVGWidth: any;
  @Input() ProductTypeList: any;

  private chart: any;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private width: number;
  private height: number;
  private lasCurve: any = [];
  private rasterCurve: any = [];
  private selectedLas: any = [];
  private selectedRaster: any = [];
  private lasData: any;
  private lasCurveData: any = [];
  private trackId: any;
  private wellId: any;
  private addTrack: any;


  constructor(private _dataService: GetcrosssectionsService) { }
  message: any;
  ngOnInit() {

    //  this.buildSVG();

  }

  ngOnChanges() {
    //   $('[data-toggle="tooltip"]').tooltip();

    this.buildSVG();
  }

  ngAfterViewInit() {
    // $('[data-toggle="tooltip"]').tooltip();

  }

  buildSVG() {
    const element = this.chartContainer.nativeElement;
    const gutter = 20;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', this.SVGWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    var trackcnt = 1;
    var startpnt = 0;
    var xcounter = 0;
    for (var i = 0; i < this.wellCount2; i++) {
      this.chart = svg.append('g')
        .attr('class', 'maingroup maingroup' + this.wellOrder[i])
        .attr('data-uwi', this.UWI[i])
        .attr('data-wellName', this.wellinfo[i])
        .attr('data-wellNumber', this.wellnumber[i])
      if (i == 0) { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter) + 10}, 10)`); }
      else {
        if (trackcnt != 1) {
          this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter + (40 * i) + 10)}, 10)`);
        }
        else {
          this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter + 10)}, 10)`);
        }
      }

      for (var j = startpnt; j < startpnt + this.trackCount[i]; j++) {

        console.log(this.trackCount[i]);
        trackcnt = this.trackCount[i];
        d3.select('.maingroup' + this.wellOrder[i])
          .append('g')
          .attr('class', 'uniq uniq' + this.wellOrder[i].toString() + j)
          .attr('transform', `translate(${((xcounter * 250)) + (xcounter * gutter)}, 0)`);
        //this.wellmetainfo(this.wellinfo[i], this.wellOrder[i].toString(), this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j]);
        this.wellmetainfo(this.wellinfo[i], this.wellOrder[i].toString(), this.wellOrder[i].toString() + j, this.UWI[i]);
        //this.wellproduct(this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j]);
        this.wellproduct(this.wellOrder[i].toString() + j, this.UWI[i],
          this.lasRasterFlag[i], this.ProductTypeList[i], this.SelectedCurveList[i]);

        //this.wellproject(this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j], this.lasRasterFlag[j], "OPEN");
        if (this.trackAndSelectedCurve[j].productType == "SMART_RASTER") {
          this.rastercomp.createRasterChartOnLoad(this.UWI[i], this.trackAndSelectedCurve[j], this.wellOrder[i].toString() + j);
          d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'none');
          d3.select(`.rasterGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');
        }
        else if (this.trackAndSelectedCurve[j].productType == "LAS_STD") {
          this.lascomp.createLasChartOnLoad(this.wellOrder[i].toString() + j, this.trackAndSelectedCurve[j], this.UWI[i]);
          d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');
          d3.select(`.rasterGrp${this.wellOrder[i].toString() + j}`).style('display', 'none');
        }

        xcounter = xcounter + 1;
      }
      startpnt = startpnt + this.trackCount[i];
      xcounter = 0;
    }
  }

  trackaction(trackId, drop1, drop2, TrackInformation) {
    // var dropdatatext = d3.select(trackId).node().innerText;

    console.log(TrackInformation);
    var dropdatatext = $('li.' + trackId + ':first').text();

    //var dropdatatext = d3.select(trackId);
    //alert(trackId);
    if (dropdatatext == "Delete") {
      //const dropclass = d3.select(trackId)
      //const dropname = d3.select(dropclass).attr('class');
      this.wellId = trackId;
    }
    else if (dropdatatext == "Add Track") {

      var currentMainGroup = document.querySelector("." + trackId).parentElement.classList[1];
      var TotalTracks = document.querySelectorAll(`.${currentMainGroup} .uniq`);
      if (TotalTracks.length < 5) {
        var translateX = TotalTracks.length * 20;
        var listClass = document.querySelectorAll(`.${currentMainGroup} .uniq`);
        var sliced = [];
        listClass.forEach(element => {
          var classes = element.classList[1];
          sliced.push(parseInt(classes.substring(4, 6)));
        });
        for (let i = 0; i < sliced.length; i++) {
          const element = sliced[i];
        }
        const newTrackNumber = (sliced[sliced.length - 1] + 1);
        console.log(d3.select(`.${currentMainGroup} .uniq`).attr('class'));
        for (var i = 0; i < TotalTracks.length; i++) {
          translateX = parseInt((TotalTracks[i].getBoundingClientRect().width.toString()), 10) + translateX;
        }

        d3.select('.' + currentMainGroup).append('g')
          .attr('class', 'uniq uniq' + newTrackNumber)
          .attr('transform', `translate(${translateX}, 0)`);

        var WellOrder = TotalTracks.length + 1
        //this.wellmetainfo("", "", randomNum, "", "");
        const currentUwId = d3.select('.' + currentMainGroup)
          .attr('data-uwi');
        const currentWellName = d3.select('.' + currentMainGroup)
          .attr('data-wellName');

        //console.log(trackObject) 
        this.wellmetainfo(currentWellName, WellOrder, newTrackNumber, currentUwId)
        //        wellmetainfo(wellname, wellorder, trackorder, uwi) {
        //this.wellproduct(newTrackNumber, currentUwId, TrackInformation);
        this.wellproject(newTrackNumber, currentUwId, TrackInformation, TrackInformation.productType, "ADD");
        //Add Space for New Incoming  Track
        this.SVGWidth = this.SVGWidth + 270;
        d3.select('svg').attr('width', this.SVGWidth)

        this.translateGenerator();

        //this.wellproduct("cook",1,"Asdasd",{});
        //this.wellproject(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j], this.lasRasterFlag[j]);
      } else {

        $('#openModalMaxAlert').click();

        // alert("Maximum Tracks Exceeded ");
      }

    }
  }

  //wellmetainfo(wellname, wellorder, trackorder, uwi, Curve) {
  wellmetainfo(wellname, wellorder, trackorder, uwi) {
    // well meta information
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const formgrp = d3.select('.uniq' + trackorder).append('g');
    const formgrpcontainer = formgrp.append('foreignObject')
      .attr('class', 'wellgroup wellgroup')
      .attr('id', 'foreignObject' + trackorder)
      //.style('height', this.lascomp.trackHeight)
      //      .style('height', element.offsetHeight - 70)
      .attr('height', '200')
      .attr('width', '250');
    const tooltipwn = `WellName : ${wellname}`;
    const tooltipuwi = ` UwId : ${uwi}`
    //  const tooltipscn = `Selected Curve : ${Curve.selectedCurve}`
    // UwId : ${uwi}
    // Selected Curve : ${Curve.selectedCurve}`
    const WellNameDiv = formgrpcontainer.append('xhtml:div')
      .attr('class', 'well-info-name  tooltip-bottom')
      // .attr('data-toggle', 'tooltip')
      // .attr('data-placement', 'bottom')
      // .attr('data-html', "true")

      .attr('data-tooltip', tooltipwn + tooltipuwi)
      //.html(`<span class='well-title' data-toggle='tooltip' data-placement='bottom' data-html='true' title='<p>${tooltipwn}</p><p>${tooltipuwi} </p>' >${wellname}</span>`);
      //.html(`<span class='well-title' title=${tooltipwn + tooltipuwi + tooltipscn}>${wellname}</span>`);
      .html(`<span class='well-title'>${wellname}</span>`);

    const Welltrack = WellNameDiv
      .append('div')
      .attr('class', 'float-right dropdown');
    if (wellorder == 1) {
      Welltrack.append('ul').attr('class', 'dropdown-menu').html("<li data-id='uniq" + trackorder + "'  class='uniq" + trackorder + "'>Add Track</li><li data-id='maingroup" + wellorder + "'  class='maingroup" + wellorder + "' data-toggle='modal' data-target='#deleteWellModal'>Delete</li>")
    }
    else {
      Welltrack.append('ul').attr('class', 'dropdown-menu').html("<li data-id='uniq" + trackorder + "' class='uniq" + trackorder + "'>Add Track</li><li data-id='maingroup" + wellorder + "'  class='maingroup" + wellorder + "' data-toggle='modal' data-target='#deleteWellModal'>Delete</li>")
    }
    const track1 = Welltrack.append('span').attr('class', 'one dropdown-toggle').attr("data-toggle", "dropdown");
    const track2 = Welltrack.append('span').attr('class', 'two');

    $('li.uniq' + trackorder).on('click',
      function (e) {



        ///New  Track Order 
        var currentMainGroup = document.querySelector('.uniq' + trackorder).parentElement.classList[1];
        var TotalTracks = document.querySelectorAll(`.${currentMainGroup} .uniq`);
        TotalTracks.length + 1
        ////


        console.log($('.uniq' + trackorder + " .productType ").html())
        var drop1list = $('.uniq' + trackorder + " .productType ").html();
        var drop2list = $('.uniq' + trackorder + " .rasterdropdown ").html();
        var drop3list = $('.uniq' + trackorder + " .lasdropdown ").text();
        var laslist = [];
        var rasterlist = [];

        for (var i = 1; i <= $('.uniq' + trackorder + " .lasdropdown option").length; i++) {
          laslist.push($('.uniq' + trackorder + " .lasdropdown option:nth-child(" + i + ")").text())
        }
        for (var i = 1; i <= $('.uniq' + trackorder + " .rasterdropdown option").length; i++) {
          rasterlist.push($('.uniq' + trackorder + " .rasterdropdown option:nth-child(" + i + ")").text())
        }

        console.log(laslist);
        console.log(drop3list);
        // var drop2list  $('.uniq' + trackorder +" .productType ").html();
        var TrackInformation = {
          "curveList": $('.uniq' + trackorder + " .productType ").val() == "SMART_RASTER" ? rasterlist : laslist,
          "productType": $('.uniq' + trackorder + " .productType ").val(),
          "selectedCurve": $('.uniq' + trackorder + " .productType ").val() == "SMART_RASTER" ? $('.uniq' + trackorder + " .rasterdropdown ").val() : $('.uniq' + trackorder + " .lasdropdown ").val(),
          "trackOrder": null,
          "uwi": uwi
        }
        this.trackaction($('li.uniq' + trackorder).attr('data-id'), drop1list, drop2list, TrackInformation)


      }.bind(this))
    $('li.maingroup' + wellorder).on('click',
      function (e) {

        // alert($(this).attr('data-id'))
        //  alert($('li.uniq' + trackorder ).attr('data-id'))

        //   this.addTrack = 'uniq' + trackorder;

        this.trackaction($('li.maingroup' + wellorder).attr('data-id'), "dfdf", "sdasd");


      }.bind(this))
    track1.append('i')
      .attr('class', 'fa fa-ellipsis-h').attr('data-target', 'dropdown');

    track2.append('i')
      .attr('class', "fa fa-times")
      .attr('data-toggle', "modal")
      .attr('data-target', "#deletemodal")
      .attr('data-id', 'uniq' + trackorder)
      .attr("id", 'uniq' + trackorder).on('click', function () {
        const dropname = 'uniq' + trackorder;
        //this.managedeletrack(dropname);
        this.trackId = dropname;
        //d3.select('.' + dropname).remove();
      }.bind(this));


  }

  // wellproduct(trackorder, uwi, TrackInformation) {

  //   console.log(TrackInformation);
  //   const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
  //     .attr('class', 'well-info-product')
  //     .attr('id', 'well-info-product' + trackorder);
  //   const productTypeDrp = WellInfoproductDiv.append('div')
  //     .attr('class', 'form-group')
  //     .append('select')
  //     .attr('data-id', TrackInformation.productType)
  //     .attr('class', 'form-control productType productType' + uwi + trackorder + " " + TrackInformation.productType)
  //   this._dataService.getProductTypes(uwi).subscribe(data => {
  //     if (data) {
  //       productTypeDrp.selectAll('option')
  //         .data(data)
  //         .enter()
  //         .append("option")

  //         .attr("value", function (d) { return d })
  //         .text(function (d) { return d })
  //       if (TrackInformation.productType == "SMART_RASTER") {
  //         d3.selectAll('.SMART_RASTER > option[value *= "SMART_RASTER"').attr('selected', true);
  //         d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
  //         d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
  //         d3.select(`.chartGrp${trackorder}`).style('display', 'none');
  //         d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
  //         d3.select(`#foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)
  //       }
  //       else if (TrackInformation.productType == "LAS_STD") {
  //         d3.selectAll('.LAS_STD > option[value *= "LAS_STD"').attr('selected', true);
  //         d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
  //         d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
  //         d3.selectAll(`.lasdropdown${trackorder}` + ' > option[value *= "' + TrackInformation.selectedCurve + '"').attr('selected', true);
  //         d3.select(`.chartGrp${trackorder}`).style('display', 'block');
  //         d3.select(`.rasterGrp${trackorder}`).style('display', 'none');
  //         d3.select(`#foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)

  //       }
  //       else if (TrackInformation.productType == "LAS_PLUS") {
  //         d3.selectAll('.LAS_PLUS > option[value *= "LAS_PLUS"').attr('selected', true);
  //         d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
  //         d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
  //         d3.select(` #foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)


  //       }
  //       else {
  //         d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
  //         d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
  //       }


  //     }
  //   })

  //   productTypeDrp.on('change', function () {
  //     console.log(d3.select(`.productType${uwi}${trackorder}`).node().value);
  //     const dropval = d3.select(`.productType${uwi}${trackorder}`).node().value;
  //     if (dropval == "SMART_RASTER") {
  //       d3.select(`.chartGrp${trackorder}`).remove();
  //       d3.select(`.rasterGrp${trackorder}`).remove();
  //       this.rastercomp.createRasterChartOnLoad(uwi, TrackInformation.selectedCurve, trackorder);
  //       d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
  //       d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
  //       d3.select(`.chartGrp${trackorder}`).style('display', 'none');
  //       d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
  //     } else if (dropval == "LAS_STD") {
  //       const tracknum = `${trackorder}`;
  //       const trackcurveval = { "selectedCurve": "" };

  //       trackcurveval.selectedCurve = "";
  //       d3.select(`.chartGrp${tracknum}`).remove();
  //       d3.select(`.rasterGrp${tracknum}`).remove();


  //       console.log($(`.lasdropdown${trackorder} option:first`).text());
  //       trackcurveval.selectedCurve = $(`.lasdropdown${trackorder} option:first`).text();
  //       console.log(trackcurveval)
  //       // d3.selectAll(`.lasdropdown${trackorder}` + '> option[value *= "'+sIndex+'"').attr('selected', true);
  //       d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
  //       d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');

  //       this.lascomp.createLasChartOnLoad(tracknum, trackcurveval, uwi);

  //       d3.select(`.chartGrp${trackorder}`).style('display', 'block');
  //       d3.select(`.rasterGrp${trackorder}`).style('display', 'none');

  //     }
  //   }.bind(this))
  // }

  wellproduct(trackorder, uwi, productType, productList, curveList) {

    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-product')
      .attr('id', 'well-info-product' + trackorder);
    const productTypeDrp = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('data-id', productType)
      .attr('class', 'form-control productType productType' + uwi + trackorder + " " + productType)

    const wellProjectDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-project')
      .attr('id', 'well-info-project' + trackorder);
    const LasDropDown = wellProjectDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control lasdropdown lasdropdown' + trackorder)

    const RasterDropDown = wellProjectDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control rasterdropdown rasterdropdown' + trackorder)


    productTypeDrp.selectAll('option')
      .data(productList)
      .enter()
      .append("option")
      .attr("value", function (d) { return d })
      .text(function (d) { return d })
    if (productType == "SMART_RASTER") {
      d3.selectAll('.SMART_RASTER > option[value *= "SMART_RASTER"').attr('selected', true);
      d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
      d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
      d3.select(`.chartGrp${trackorder}`).style('display', 'none');
      d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
      d3.select(`.rastersegment${trackorder}`).style('display', 'block');

      this.wellproject(trackorder, uwi, curveList[productType], productType, "OPEN")
      //d3.select(`#foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)
    }
    else if (productType == "LAS_STD") {
      d3.selectAll('.LAS_STD > option[value *= "LAS_STD"').attr('selected', true);
      d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
      d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
      d3.select(`.rastersegment${trackorder}`).style('display', 'none');

      // d3.selectAll(`.lasdropdown${trackorder}` + ' > option[value *= "' + TrackInformation.selectedCurve + '"').attr('selected', true);
      d3.select(`.chartGrp${trackorder}`).style('display', 'block');
      d3.select(`.rasterGrp${trackorder}`).style('display', 'none');
      this.wellproject(trackorder, uwi, curveList[productType], productType, "OPEN")
      // d3.select(`#foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)

    }
    else if (productType == "LAS_PLUS") {
      d3.selectAll('.LAS_PLUS > option[value *= "LAS_PLUS"').attr('selected', true);
      d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
      d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
      d3.select(`.rastersegment${trackorder}`).style('display', 'none');

      // d3.select(` #foreignObject${trackorder} .well-info-product`).attr('class', 'well-info-product ' + TrackInformation.productType)
      this.wellproject(trackorder, uwi, curveList[productType], productType, "OPEN")

    }
    else {
      d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
      d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
    }





    productTypeDrp.on('change', function () {
      console.log(d3.select(`.productType${uwi}${trackorder}`).node().value);
      const dropval = d3.select(`.productType${uwi}${trackorder}`).node().value;
      if (dropval == "SMART_RASTER") {
        d3.select(`.chartGrp${trackorder}`).remove();
        d3.select(`.rasterGrp${trackorder}`).remove();
        //this.rastercomp.createRasterChartOnLoad(uwi, TrackInformation.selectedCurve, trackorder);
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
        d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
        d3.select(`.chartGrp${trackorder}`).style('display', 'none');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
        this.wellproject(trackorder, uwi, curveList[dropval], dropval, "OPEN")
        const selectedCurve = d3.select('.rasterdropdown' + trackorder).node().value;

        this.loadercomp.getcsvLoader(trackorder)
        this.rastercomp.createRasterChartOnLoad(trackorder, uwi, dropval, selectedCurve, "2")
        d3.select(`.rastersegment${trackorder}`).style('display', 'block');

      } else if (dropval == "LAS_STD") {
        const tracknum = `${trackorder}`;
        d3.select(`.chartGrp${tracknum}`).remove();
        d3.select(`.rasterGrp${tracknum}`).remove();
        const selectedCurve = d3.select('.lasdropdown' + trackorder).node().value;

        this.wellproject(trackorder, uwi, curveList[dropval], dropval, "OPEN")

        if (selectedCurve !== "") {
          console.log(`.lasdropdown${trackorder}   ` + (d3.select('.lasdropdown' + trackorder).node().value))
          d3.select(`.chartGrp${tracknum}`).remove();
          this.loadercomp.getcsvLoader(tracknum)
          this.lascomp.createLasChartOnLoad(tracknum, uwi, dropval, selectedCurve)
        } else {
          d3.select(`.chartGrp${tracknum}`).remove();
        }

        console.log($(`.lasdropdown${trackorder} option:first`).text());
        // trackcurveval.selectedCurve = $(`.lasdropdown${trackorder} option:first`).text();
        //console.log(trackcurveval)
        // d3.selectAll(`.lasdropdown${trackorder}` + '> option[value *= "'+sIndex+'"').attr('selected', true);
        d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
        d3.select(`.rastersegment${trackorder}`).style('display', 'none');

        // this.lascomp.createLasChartOnLoad(tracknum, trackcurveval, uwi);

        d3.select(`.chartGrp${trackorder}`).style('display', 'block');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'none');


      }
    }.bind(this))
  }

  wellproject(trackorder, uwi, TrackInformation, Flag, AddOrOpen) {
    //console.log(TrackInformation.curveList);
    const LasDropDown = d3.select('.lasdropdown' + trackorder);
    const RasterDropDown = d3.select('.rasterdropdown' + trackorder);

    if (Flag == "SMART_RASTER") {
      LasDropDown.style('display', 'none');
      RasterDropDown.style('display', 'block');
      const rasterCurve: any = [];


      rasterCurve.push(TrackInformation)
      if (rasterCurve != undefined) {
        RasterDropDown.selectAll("option")
          .data(TrackInformation)
          .enter()
          .append("option")
          .attr("value", function (d) { return d })
          .text(function (d) { return d })

      } else {
        RasterDropDown.append("option")
          .attr("value", "No Raster Data Found")
          .text("No Raster Data Found")
      }
      RasterDropDown.style('display', 'block');

    } else if (Flag == "LAS_STD") {
      const lasCurve: any = [];

      lasCurve.push(TrackInformation);
      //console.log(lasCurve)
      ///console.log(lasCurve[0]);
      RasterDropDown.style('display', 'none');
      LasDropDown.style('display', 'block');
      if (lasCurve != undefined) {

        LasDropDown.selectAll("option")
          .data(TrackInformation)
          .enter()
          .append("option")
          .attr("value", function (d, ) { return d })
          .text(function (d, ) { return d })
      } else {
        LasDropDown.append("option")
          .attr("value", "No Raster Data Found")
          .text("No Las Data Found")
      }
    }




    LasDropDown.on('change', function () {
      const tracknum = `${trackorder}`;
      const selectedCurve = d3.select('.lasdropdown' + trackorder).node().value;
      //this.lascomp.createLasChartOnLoad(tracknum, trackcurveval);
      //d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');

      if (selectedCurve !== "") {
        console.log(`.lasdropdown${trackorder}   ` + (d3.select('.lasdropdown' + trackorder).node().value))
        //this.createChartOnchange(this.value);
        d3.select(`.chartGrp${tracknum}`).remove();
        this.loadercomp.getcsvLoader(tracknum)
        this.lascomp.createLasChartOnLoad(tracknum, uwi, Flag, selectedCurve)
      } else {
        d3.select(`.chartGrp${tracknum}`).remove();
      }
    }.bind(this))


    RasterDropDown.on('change', function () {
      const tracknum = `${trackorder}`;
      const selectedCurve = d3.select('.rasterdropdown' + trackorder).node().value;

      if (selectedCurve !== "Select Curve") {
        console.log(`.rasterdropdown${trackorder}   ` + (d3.select('.rasterdropdown' + trackorder).node().value))
        //this.createChartOnchange(this.value);
        d3.select(`.rasterGrp${tracknum}`).remove();
        this.loadercomp.getcsvLoader(tracknum)
        this.rastercomp.createRasterChartOnLoad(tracknum, uwi, Flag, selectedCurve, "2")
      } else {
        d3.select(`.rasterGrp${tracknum}`).remove();
      }
    }.bind(this))



  }




  // wellproject(trackorder, uwi, TrackInformation, Flag, AddOrOpen) {
  //   //console.log(TrackInformation.curveList);
  //   const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
  //     .attr('class', 'well-info-project')
  //     .attr('id', 'well-info-project' + trackorder);
  //   const LasDropDown = WellInfoproductDiv.append('div')
  //     .attr('class', 'form-group')
  //     .append('select')
  //     .attr('class', 'form-control lasdropdown lasdropdown' + trackorder)

  //   const RasterDropDown = WellInfoproductDiv.append('div')
  //     .attr('class', 'form-group')
  //     .append('select')
  //     .attr('class', 'form-control rasterdropdown rasterdropdown' + trackorder)

  //   if (Flag == "SMART_RASTER") {
  //     LasDropDown.style('display', 'none');
  //     RasterDropDown.style('display', 'block');
  //     const rasterCurve: any = [];
  //     if (AddOrOpen == "ADD") {
  //       rasterCurve.push('Select Curve')
  //       // .attr('value', "Select Curve")
  //       // .text("Select Curve")
  //     }

  //     rasterCurve.push(TrackInformation.curveList[0])
  //     if (rasterCurve != undefined) {
  //       //RasterDropDown.append("option").attr("value", "Select").text("Select Curve")
  //       // if (AddOrOpen == "ADD") {
  //       //   RasterDropDown.append('option')
  //       //     .attr('value', "Select Curve")
  //       //     .text("Select Curve")
  //       // }
  //       RasterDropDown.selectAll("option")
  //         .data(TrackInformation.curveList[0])
  //         .enter()
  //         .append("option")
  //         .attr("value", function (d) { return d })
  //         .text(function (d) { return d })

  //     } else {
  //       RasterDropDown.append("option")
  //         .attr("value", "No Raster Data Found")
  //         .text("No Raster Data Found")
  //     }
  //     RasterDropDown.style('display', 'block');

  //   } else if (Flag == "LAS_STD") {
  //     const lasCurve: any = [];

  //     lasCurve.push(TrackInformation.curveList);
  //     console.log(lasCurve)
  //     console.log(lasCurve[0]);
  //     RasterDropDown.style('display', 'none');
  //     LasDropDown.style('display', 'block');
  //     if (lasCurve[0] != undefined) {
  //       if (AddOrOpen == "ADD") {
  //         LasDropDown.append('option')
  //           .attr('value', "Select Curve")
  //           .text("Select Curve")
  //       }
  //       LasDropDown.selectAll("option")
  //         .data(lasCurve[0])
  //         .enter()
  //         .append("option")
  //         .attr("value", function (d, ) { return d })
  //         .text(function (d, ) { return d })
  //     } else {
  //       LasDropDown.append("option")
  //         .attr("value", "No Raster Data Found")
  //         .text("No Las Data Found")
  //     }
  //   }




  //   LasDropDown.on('change', function () {
  //     const tracknum = `${trackorder}`;
  //     const trackcurveval = { "selectedCurve": "" };
  //     trackcurveval.selectedCurve = d3.select('.lasdropdown' + trackorder).node().value;
  //     //this.lascomp.createLasChartOnLoad(tracknum, trackcurveval);
  //     //d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');

  //     if (trackcurveval.selectedCurve !== "Select Curve") {
  //       console.log(`.lasdropdown${trackorder}   ` + (d3.select('.lasdropdown' + trackorder).node().value))
  //       //this.createChartOnchange(this.value);
  //       d3.select(`.chartGrp${tracknum}`).remove();
  //       this.loadercomp.getcsvLoader(tracknum)
  //       this.lascomp.createLasChartOnLoad(tracknum, trackcurveval, uwi)
  //     } else {
  //       d3.select(`.chartGrp${tracknum}`).remove();
  //     }
  //   }.bind(this))


  //   RasterDropDown.on('change', function () {
  //     const tracknum = `${trackorder}`;
  //     const trackcurveval = { "selectedCurve": "" };
  //     trackcurveval.selectedCurve = d3.select('.rasterdropdown' + trackorder).node().value;
  //     //this.lascomp.createLasChartOnLoad(tracknum, trackcurveval);
  //     //d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');

  //     if (trackcurveval.selectedCurve !== "Select Curve") {
  //       console.log(`.rasterdropdown${trackorder}   ` + (d3.select('.rasterdropdown' + trackorder).node().value))
  //       //this.createChartOnchange(this.value);
  //       d3.select(`.rasterGrp${tracknum}`).remove();
  //       this.loadercomp.getcsvLoader(tracknum)
  //       this.rastercomp.createRasterChartOnLoad(uwi, trackcurveval, tracknum)
  //     } else {
  //       d3.select(`.rasterGrp${tracknum}`).remove();
  //     }
  //   }.bind(this))



  // }

  managedeletrack($event, trackorder) {
    //const tracknum = trackorder;
    this.trackId = $event;
    //this.deletrack($event)
    console.log($event);
  }

  deletrack() {
    const _id = this.trackId;
    var neigbour = document.querySelector("." + _id).nextElementSibling;

    var currentMainGroup = document.querySelector("." + _id).parentElement.classList[1]
    var listNums = [0];
    d3.select(`.${_id}`).remove();

    var listItem = document.querySelectorAll(`.${currentMainGroup} .uniq`);
    for (var i = 0; i < listItem.length - 1; i++) {
      listNums.push(parseInt((listItem[i].getBoundingClientRect().width.toString()), 10) + listNums[i]);
    }

    for (let i = 0; i < listItem.length; i++) {

      if (i == 0) {
        d3.select(`.${currentMainGroup} .uniq:nth-child(${i + 1})`).attr('transform', `translate(${listNums[i]},0)`)
      }
      else {
        d3.select(`.${currentMainGroup} .uniq:nth-child(${i + 1})`).attr('transform', `translate(${listNums[i] + (i * 20)},0)`)

      }
    }
    this.SVGWidth = this.SVGWidth - 270;
    d3.select('svg').attr('width', this.SVGWidth)

    this.translateGenerator();
  }
  delewell() {
    this.SVGWidth = this.SVGWidth - document.querySelector('.' + this.wellId).getBoundingClientRect().width
    d3.select('svg').attr('width', this.SVGWidth)

    var _id = this.wellId;
    d3.select(`.${_id}`).remove();
    d3.select('.cst-card-header-badge').text(document.querySelectorAll('.maingroup').length);
    this.translateGenerator();
  }
  translateGenerator() {
    var listItem = document.querySelectorAll(".maingroup ");

    var newNums = [0];

    for (var i = 0; i < listItem.length - 1; i++) {
      newNums.push(parseInt((listItem[i].getBoundingClientRect().width.toString()), 10) + newNums[i]);
    }
    console.log(newNums)
    for (var i = 0; i < listItem.length; i++) {
      if (i == 0) {
        d3.select(`.maingroup:nth-child(${i + 1})`).attr('transform', `translate(${newNums[i] + 10},10)`)
      } else {
        d3.select(`.maingroup:nth-child(${i + 1})`).attr('transform', `translate(${newNums[i] + (i * 30)},10)`)

      }

      //d3.select(`.mainGrp:nth-child(${i + 1})`).attr('transform', `translate(${newNums[i - 1] + 40},10)`)


    }



  }






  Onresize(e) {
    d3.select('svg').remove();
    this.buildSVG();
    d3.select('svg').attr('width', this.SVGWidth)
  }




  // createRasterChartOnLoad(wellId, trackorder) {
  //   //this._dataService.getRasterData(wellId).subscribe(rasterData => {


  //   const rasterGroup = d3.select('.uniq' + trackorder + ' g').append('g').attr('class', 'rasterGrp rasterGrp' + trackorder).attr('transform', 'translate(0,150)');

  //   //       const tooltipInfo = `WellName : ${rasterData.wellName} 
  //   // UwId : ${wellId}
  //   // Selected Curve : ${rasterData.curveName}`


  //   var rasterImg = rasterGroup.append('foreignObject')
  //     .attr('width', '250')
  //     .attr('height', '380')
  //   const rasterDiv = rasterImg.append('xhtml:div')
  //     .attr('class', 'rastergrp imggrp')
  //     // .attr('title', tooltipInfo)
  //     .append('img')
  //     .attr('src', 'http://localhost:8080/getTiffFile?tiffFileName=us50089200010000_4629856')
  //     .attr('class', 'imgsize')

  //   //Yscale for raster Image start
  //   var data = [794, 14804];
  //   const yscale = d3.scaleLinear().domain([700, d3.max(data)]).range([0, 300]);
  //   const yAxis = d3.axisLeft(yscale).ticks(5); // Y axis    
  //   rasterGroup.append('g')
  //     .attr('transform', 'translate(45,0)')
  //     .attr('class', 'axisred')
  //     .call(yAxis);
  //   //Yscale for raster Image End

  //   //})



  // }

}
