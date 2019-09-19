import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';

@Component({
  selector: 'app-wellmetadata',
  templateUrl: './wellmetadata.component.html',
  styleUrls: ['./wellmetadata.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WellmetadataComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) chartContainer: ElementRef;
  @Input() wellCount2: Number;
  @Input() wellinfo: any;
  @Input() wellnumber: any;
  @Input() UWI: any;
  @Input() wellOrder: any;
  @Input() trackorder: any;
  @Input() curveListData: any;
  @Input() lasRasterFlag: any;
  @Input() SelectedCurveList: any;
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
  ngOnInit() {

    for (let i = 0; i < this.lasRasterFlag.length; i++) {
      if (this.lasRasterFlag[i] == "SMART_RASTER") {
        this.rasterCurve.push(this.curveListData[i]);
        this.selectedRaster.push(this.SelectedCurveList[i]);
      } else {
        this.lasCurve.push(this.curveListData[i]);
        this.selectedLas.push(this.SelectedCurveList[i]);

      }

    }
    console.log(this.wellCount2);
    console.log(this.wellinfo);
    console.log(this.wellnumber);
    console.log(this.UWI);
    console.log(this.wellOrder);
    console.log(this.trackorder);
    console.log(this.curveListData);
    console.log(this.lasRasterFlag);

    console.log('las', this.selectedLas);
    console.log('raster', this.selectedRaster)

    this.createChart();

  }

  ngOnChanges() {

  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    const gutter = 20;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', '2000')
      .attr('height', element.offsetHeight);

    // chart plot area
    var trackcnt = 1;
    var wellCount = parseInt(this.wellCount2.toString());
    for (var i = 0; i < (wellCount); i++) {

      this.chart = svg.append('g')
        .attr('class', 'maingroup maingroup' + this.wellOrder[i])
      if (i == 0) { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter)}, 0)`); }
      else { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter + (20 * i))}, 0)`); }

      for (var j = 0; j < parseInt(this.trackorder[i].toString()); j++) {
        console.log(this.trackorder[i]);
        trackcnt = this.trackorder[i];
        d3.select('.maingroup' + this.wellOrder[i])
          .append('g')
          .attr('class', 'uniq uniq' + this.wellOrder[i].toString() + j)
          .attr('transform', `translate(${((j * 250)) + (j * gutter)}, 0)`);
        this.wellmetainfo(this.wellinfo[i], this.wellOrder[i].toString(), this.wellOrder[i].toString() + j, this.UWI[i]);
        this.wellproduct(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i]);
        this.wellproject(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i], this.lasCurve[i], this.rasterCurve[i], this.lasRasterFlag[i]);
        this.createLasChartOnLoad(this.wellOrder[i].toString() + j,
          this.selectedLas[i], this.UWI[i]);
        this.createRasterChartOnLoad(this.UWI[i], this.wellOrder[i].toString() + j)
      }

      console.log(element)

    }


  }

  wellmetainfo(wellname, wellorder, trackorder, uwi) {
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

    const WellNameDiv = formgrpcontainer.append('xhtml:div')
      .attr('class', 'well-info-name')
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
      .attr("id", 'uniq' + trackorder).on('click', function () {
        const dropname = this.id;
        d3.select('.' + dropname).remove();
      });


  }

  wellproduct(wellname, trackorder, uwi) {
    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-product')
      .attr('id', 'well-info-product' + trackorder);

    //Creating RadioLas -START
    const LasRadioDiv = WellInfoproductDiv.append('div')
      .attr('class', 'custom-control custom-radio custom-control-inline')

    const LasBtn = LasRadioDiv.append('input')
      .attr('class', 'custom-control-input')
      .attr('type', 'radio')
      .attr('name', 'inlineRadioOptions' + trackorder)
      .attr('id', 'inlineRadioLas' + trackorder + "las")
      .attr('value', 'LAS' + trackorder)
      .on('change', function (d) {
        d3.select(`.lasdropdown${trackorder}`).style('display', 'block');
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'none');
        d3.select(`.chartGrp${trackorder}`).style('display', 'block');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'none');


      });

    const laslabel = LasRadioDiv.append('label')
      .attr('class', 'custom-control-label')
      .attr('for', 'inlineRadioLas' + trackorder + "las")
      .html('LAS');

    //Creating RadioRaster -START
    const RasterRadioDiv = WellInfoproductDiv.append('div')
      .attr('class', 'custom-control custom-radio custom-control-inline')


    const RasterBtn = RasterRadioDiv.append('input')
      .attr('class', 'custom-control-input')
      .attr('type', 'radio')
      .attr('name', 'inlineRadioOptions' + trackorder)
      .attr('id', 'inlineRadioRaster' + trackorder + "raster")
      .attr('value', 'Raster' + trackorder)
      .attr('checked', 'checked')
      .on('change', function (d) {
        d3.select(`.rasterdropdown${trackorder}`).style('display', 'block');
        d3.select(`.lasdropdown${trackorder}`).style('display', 'none');
        d3.select(`.chartGrp${trackorder}`).style('display', 'none');
        d3.select(`.rasterGrp${trackorder}`).style('display', 'block');


      });
    const Rasterlabel = RasterRadioDiv.append('label')
      .attr('class', 'custom-control-label')
      .attr('for', 'inlineRadioRaster' + trackorder + "raster")
      .html('Raster');

  }

  wellproject(wellname, trackorder, uwi, lasCurve, rasterCurve, Flag) {
    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-project')
      .attr('id', 'well-info-project' + trackorder);
    const LasDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control lasdropdown lasdropdown' + trackorder)
      .style('display', 'none');
    if (lasCurve != undefined) {
      LasDropDown.selectAll("option")
        .data(lasCurve)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d })
    } else {
      LasDropDown.append("option")
        .attr("value", "No Raster Data Found")
        .text("No Las Data Found")
    }
    // LasDropDown.on('change', function (d) {
    //   console.log(d3.select(this))
    //   WellmetadataComponent.createChartOnchange(this.value, trackorder);

    // })

    LasDropDown.on('change', function () {
      console.log(`.lasdropdown${trackorder}   ` + (d3.select('.lasdropdown' + trackorder).node().value))
      this.createChartOnchange(this.value);

    }.bind(this))


    const RasterDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control rasterdropdown rasterdropdown' + trackorder)
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



  }
  createChartOnchange(value: any) {
    alert(value)
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








  createLasChartOnLoad(trackorder, lasCurve, wellId) {
    // well meta information
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const formgrp = d3.select('.uniq' + trackorder).append('g').append('rect');
    console.log(lasCurve)
    this._dataService.getLasData(wellId, lasCurve).subscribe(data => {

      if (Object.keys(data).length !==0) {
        this.lasCurveData = data;
        // this.lasCurveData = this.lasData.curves
        console.log(this.lasCurveData);
        // console.log(lasCurve + "AND" + wellId)
        const xScale = d3.scaleLinear().domain(d3.extent(this.lasCurveData.curves, function (d) { return d[0] })).nice().range([0, 210]); // Xaxis Scale
        const yScale = d3.scaleLinear().domain([d3.max(this.lasCurveData.curves, function (d) { return d[1] }), d3.min(this.lasCurveData.curves, function (d) { return d[1] })]).range([300, 0]); // Yaxis Scale

        const xAxis = d3.axisTop(xScale).tickSize(-300).ticks(5); // Xaxis 
        const yAxis = d3.axisLeft(yScale).tickSize(-210).ticks(5); // Y axis 
        const line = d3.line()
          .x(function (d) { return xScale(d[0]) })
          .y(function (d) { return yScale(d[1]) })
          .curve(d3.curveCardinal) // Cardinal graph generater
        const grp = d3.select('.uniq' + trackorder + ' g');
        //console.log(`.mainGrp${trackorder}`);
        const chartGroup = grp.append('g').attr('class', 'chartGrp chartGrp' + trackorder).attr('transform', 'translate(30 ,160)')
          .style('display', 'none');
        // const cgrp = d3.select('chartGrp' +uwid + curveName);
        // console.log(cgrp);
        //const rastergrp = grp.append('g').attr('class', 'rasterGrp' + _well[0].UWI.UWI + _well[0].UWI.curveName).attr('transform', 'translate(' + ((order * 290)) + ',100)');
        const grpXAxis = chartGroup.append('g').attr('class', 'axisred').attr('transform', 'translate(6,0)').transition()
          .duration(3000);
        grpXAxis.call(xAxis);
        const grpYAxis = chartGroup.append('g').attr('class', 'axisred').attr('transform', 'translate(6,0)').transition()
          .duration(3000);
        grpYAxis.call(yAxis);

        d3.select(`.uniq${trackorder}  .loader`).style('display', 'none');
        /// Drawing Path by sending Data points 
        chartGroup.append("path")
          .transition()
          .duration(3000)
          .attr('transform', 'translate(11,2)')
          .attr("d", line(this.lasCurveData.curves))
          .attr('class', 'lasgrp')
          .attr('fill', 'none')
          .attr('stroke-width', 1)
          .attr('stroke', this.lasCurveData.curveColor)
      }
    })

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
