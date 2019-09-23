import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import 'bootstrap';
import * as $ from 'jquery';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { RasterComponent } from '../raster/raster.component';
import { LasComponent } from '../las/las.component';

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


  constructor(private _dataService: GetcrosssectionsService) { }
  message: any;
  ngOnInit() {

    // for (let i = 0; i < this.lasRasterFlag.length; i++) {
    //   if (this.lasRasterFlag[i] == "SMART_RASTER") {
    //     this.rasterCurve.push(this.curveListData[i]);
    //     this.selectedRaster.push(this.SelectedCurveList[i]);
    //   } else {
    //     this.lasCurve.push(this.curveListData[i]);
    //     this.selectedLas.push(this.SelectedCurveList[i]);

    //   }

    // }


    // console.log('las', this.selectedLas);
    // console.log('selectedTrack', this.trackAndSelectedCurve)


    this.buildSVG();

  }

  ngOnChanges() {
    //   $('[data-toggle="tooltip"]').tooltip();
  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  buildSVG() {
    const element = this.chartContainer.nativeElement;
    const gutter = 20;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', '2000')
      .attr('height', element.offsetHeight);

    // chart plot area
    var trackcnt = 1;
    var startpnt = 0;
    var xcounter = 0;
    for (var i = 0; i < this.wellCount2; i++) {
      this.chart = svg.append('g')
        .attr('class', 'maingroup maingroup' + this.wellOrder[i])
      if (i == 0) { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter)}, 0)`); }
      else { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter + (40 * i))}, 0)`); }

      for (var j = startpnt; j < startpnt + this.trackCount[i]; j++) {

        console.log(this.trackCount[i]);
        trackcnt = this.trackCount[i];
        d3.select('.maingroup' + this.wellOrder[i])
          .append('g')
          .attr('class', 'uniq uniq' + this.wellOrder[i].toString() + j)
          .attr('transform', `translate(${((xcounter * 250)) + (xcounter * gutter)}, 0)`);
        this.wellmetainfo(this.wellinfo[i], this.wellOrder[i].toString(), this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j]);
        this.wellproduct(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j]);
        this.wellproject(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i], this.trackAndSelectedCurve[j], this.lasRasterFlag[j]);
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

  wellmetainfo(wellname, wellorder, trackorder, uwi, Curve) {
    // well meta information
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const formgrp = d3.select('.uniq' + trackorder).append('g');
    const formgrpcontainer = formgrp.append('foreignObject')
      .attr('class', 'wellgroup wellgroup')
      .attr('id', 'foreignObject' + trackorder)
      .style('height', element.offsetHeight - 20)
      .style('width', '250');
    const tooltipwn = `WellName : ${wellname}`
    const tooltipuwi = `UwId : ${uwi}`
    const tooltipscn = `Selected Curve : ${Curve.selectedCurve}`
    // UwId : ${uwi}
    // Selected Curve : ${Curve.selectedCurve}`
    const WellNameDiv = formgrpcontainer.append('xhtml:div')
      .attr('class', 'well-info-name')
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('data-html', "true")
      .attr('title', '<p>' + tooltipwn + '</p>' + '<p>' + tooltipuwi + '</p>' + '<p>' + tooltipscn + '</p>')
      .html("<span class='well-title'>" + wellname + "</span>");
    const Welltrack = WellNameDiv
      .append('div')
      .attr('class', 'float-right dropdown');
    if (wellorder == 1) {
      Welltrack.append('ul').attr('class', 'dropdown-menu').html("<li class='maingroup" + wellorder + "'>Add Track</li><li class='maingroup" + wellorder + "'>Delete</li>")
    }
    else {
      Welltrack.append('ul').attr('class', 'dropdown-menu').html("<li class='maingroup" + wellorder + "'>Add Track</li><li class='maingroup" + wellorder + "'>Delete</li>")
    }
    const track1 = Welltrack.append('span').attr('class', 'one dropdown-toggle').attr("data-toggle", "dropdown");
    const track2 = Welltrack.append('span').attr('class', 'two');

    d3.selectAll('.dropdown-menu li').on('click', this.trackaction)
    track1.append('i')
      .attr('class', 'fa fa-ellipsis-h');

    track2.append('i')
      .attr('class', "fa fa-times")
      .attr('data-toggle',"modal")
      .attr('data-target',"#deletemodal")
      .attr("id", 'uniq' + trackorder).on('click', function () {
        const dropname = trackorder;
        this.managedeletrack(dropname);
        //d3.select('.' + dropname).remove();
      }.bind(this));


  }

  wellproduct(wellname, trackorder, uwi, TrackInformation) {
    //console.log(TrackInformation);
    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-product')
      .attr('id', 'well-info-product' + trackorder);
    const productTypeDrp = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('data-id', TrackInformation.productType)
      .attr('class', 'form-control productType productType' + uwi + trackorder + " " + TrackInformation.productType)
    this._dataService.getProductTypes(uwi).subscribe(data => {
      if (data) {
        productTypeDrp.selectAll('option')
          .data(data)
          .enter()
          .append("option")

          .attr("value", function (d) { return d })
          .text(function (d) { return d })
        if (TrackInformation.productType == "SMART_RASTER") {
          d3.selectAll('.SMART_RASTER > option[value *= "SMART_RASTER"').attr('selected', true);
          d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
          d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
          d3.select(`.chartGrp${trackorder}`).style('display', 'none');
          d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
        }
        else if (TrackInformation.productType == "LAS_STD") {
          d3.selectAll('.LAS_STD > option[value *= "LAS_STD"').attr('selected', true);
          d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
          d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
          d3.selectAll(`.lasdropdown${trackorder}` + ' > option[value *= "' + TrackInformation.selectedCurve + '"').attr('selected', true);
          d3.select(`.chartGrp${trackorder}`).style('display', 'block');
          d3.select(`.rasterGrp${trackorder}`).style('display', 'none');
        }
        else if (TrackInformation.productType == "LAS_PLUS") {
          d3.selectAll('.LAS_PLUS > option[value *= "LAS_PLUS"').attr('selected', true);
          d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
          d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');

        }
        else{
          d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
          d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
        }
        

      }
    })

    productTypeDrp.on('change', function () {
      console.log(d3.select(`.productType${uwi}${trackorder}`).node().value);
      const dropval = d3.select(`.productType${uwi}${trackorder}`).node().value;
      if (dropval == "SMART_RASTER") {
        d3.select(`.chartGrp${trackorder}`).remove();
        d3.select(`.rasterGrp${trackorder}`).remove();
        this.rastercomp.createRasterChartOnLoad(uwi, TrackInformation.selectedCurve, trackorder);
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
        d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
        d3.select(`.chartGrp${trackorder}`).style('display', 'none');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'block');
      } else if (dropval == "LAS_STD") {
        const tracknum = `${trackorder}`;
        const trackcurveval = { "selectedCurve": "" };
        
        //trackcurveval.selectedCurve = d3.select(this).node().value;
        d3.select(`.chartGrp${tracknum}`).remove();
        d3.select(`.rasterGrp${tracknum}`).remove();
         
        
       
       
       // d3.selectAll(`.lasdropdown${trackorder}` + '> option[value *= "'+sIndex+'"').attr('selected', true);
        d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
        this.lascomp.createLasChartOnLoad(tracknum, trackcurveval, uwi);
        d3.select(`.chartGrp${trackorder}`).style('display', 'block');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'none');

      }
    }.bind(this))
  }

  wellproject(wellname, trackorder, uwi, TrackInformation, Flag) {
    //console.log(TrackInformation.curveList);
    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-project')
      .attr('id', 'well-info-project' + trackorder);
    const LasDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control lasdropdown lasdropdown' + trackorder)

    const RasterDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control rasterdropdown rasterdropdown' + trackorder)

    if (Flag == "SMART_RASTER") {
      LasDropDown.style('display', 'none');
      RasterDropDown.style('display', 'block');
      const rasterCurve: any = [];

      rasterCurve.push(TrackInformation.curveList)
      if (rasterCurve != undefined) {
        RasterDropDown.selectAll("option")
          .data(rasterCurve)
          .enter()
          .append("option")
          .attr("value", function (d) { return d })
          .text(function (d) { return d })
      } else {
        RasterDropDown.append("option")
          .attr("value", "No Raster Data Found")
          .text("No Raster Data Found")
      }

    } else if (Flag == "LAS_STD") {
      const lasCurve: any = [];
      lasCurve.push(TrackInformation.curveList);
      console.log(lasCurve)
      console.log(lasCurve[0]);
      RasterDropDown.style('display', 'none');
      LasDropDown.style('display', 'block');
      if (lasCurve[0] != undefined) {
        LasDropDown.selectAll("option")
          .data(lasCurve[0])
          .enter()
          .append("option")
          .attr("value", function (d, i) { return lasCurve[0][i] })
          .text(function (d, i) { return lasCurve[0][i] })
      } else {
        LasDropDown.append("option")
          .attr("value", "No Raster Data Found")
          .text("No Las Data Found")
      }
    }


    

    LasDropDown.on('change', function () {
      const tracknum = `${trackorder}`;
      const trackcurveval = { "selectedCurve": "" };
      trackcurveval.selectedCurve = d3.select('.lasdropdown' + trackorder).node().value;
      //this.lascomp.createLasChartOnLoad(tracknum, trackcurveval);
      //d3.select(`.chartGrp${this.wellOrder[i].toString() + j}`).style('display', 'block');
      console.log(`.lasdropdown${trackorder}   ` + (d3.select('.lasdropdown' + trackorder).node().value))
      //this.createChartOnchange(this.value);
      d3.select(`.chartGrp${tracknum}`).remove();
      this.lascomp.createLasChartOnLoad(tracknum, trackcurveval, uwi)

    }.bind(this))




    // if (Flag == "SMART_RASTER") {
    //   LasDropDown.style('display', 'none');
    //   RasterDropDown.style('display', 'block');
    // } else if (Flag == "LAS_STD") {
    //   RasterDropDown.style('display', 'none');
    //   LasDropDown.style('display', 'block');
    // }


  }

  managedeletrack($event, trackorder) {
    const tracknum = trackorder;
    this.deletrack($event,tracknum)
  }

  deletrack($event,tracknum) {
    
    
   // d3.select('.uniq'+tracknum).remove();
    console.log($event,tracknum);
  
  }

  trackaction(wellorder, trackorder) {
    var dropdatatext = d3.select(this).node().innerText;
    if (dropdatatext == "Delete") {
      const dropclass = d3.select(this).node();
      const dropname = d3.select(dropclass).attr('class');
      d3.select('.' + dropname).remove();

    }
    else if (dropdatatext == "Add Track") {
      const dropclass = d3.select(this).node();
      const dropname = d3.select(dropclass).attr('class');
      //alert(dropname);
      const randomNum = Math.ceil(Math.random() * 100);
      d3.select('.' + dropname).append('g').attr('class', 'uniq uniq' + randomNum);


    }
  }














  createRasterChartOnLoad(wellId, trackorder) {
    //this._dataService.getRasterData(wellId).subscribe(rasterData => {


    const rasterGroup = d3.select('.uniq' + trackorder + ' g').append('g').attr('class', 'rasterGrp rasterGrp' + trackorder).attr('transform', 'translate(0,150)');

    //       const tooltipInfo = `WellName : ${rasterData.wellName} 
    // UwId : ${wellId}
    // Selected Curve : ${rasterData.curveName}`


    var rasterImg = rasterGroup.append('foreignObject')
      .attr('width', '250')
      .attr('height', '380')
    const rasterDiv = rasterImg.append('xhtml:div')
      .attr('class', 'rastergrp imggrp')
      // .attr('title', tooltipInfo)
      .append('img')
      .attr('src', 'http://localhost:8080/getTiffFile?tiffFileName=us50089200010000_4629856')
      .attr('class', 'imgsize')

    //Yscale for raster Image start
    var data = [794, 14804];
    const yscale = d3.scaleLinear().domain([700, d3.max(data)]).range([0, 300]);
    const yAxis = d3.axisLeft(yscale).ticks(5); // Y axis    
    rasterGroup.append('g')
      .attr('transform', 'translate(45,0)')
      .attr('class', 'axisred')
      .call(yAxis);
    //Yscale for raster Image End

    //})



  }

}
