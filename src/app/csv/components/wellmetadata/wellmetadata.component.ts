import { Component, OnInit, OnChanges, ViewChild,AfterViewInit, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

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
  private chart: any;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private width: number;
  private height: number;
  constructor() {

  }

  ngOnInit() {


    console.log(this.wellCount2);
    console.log(this.wellinfo);
    console.log(this.wellnumber);
    console.log(this.UWI);
    console.log(this.wellOrder);
    console.log(this.trackorder);
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
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    var trackcnt = 1;
    for (var i = 0; i < this.wellCount2; i++) {

      this.chart = svg.append('g')
        .attr('class', 'maingroup maingroup' + this.wellOrder[i])
      if (i == 0) { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter)}, 0)`); }
      else { this.chart.attr('transform', `translate(${((i * 250) * trackcnt) + ((i) * gutter + 40)}, 0)`); }

      for (var j = 0; j < this.trackorder[i]; j++) {
        console.log(this.trackorder[i]);
        trackcnt = this.trackorder[i];
        d3.select('.maingroup' + this.wellOrder[i])
          .append('g')
          .attr('class', 'uniq uniq' + this.wellOrder[i].toString() + j)
          .attr('transform', `translate(${((j * 250)) + (j * gutter)}, 0)`);
        this.wellmetainfo(this.wellinfo[i], this.wellOrder[i].toString(), this.wellOrder[i].toString() + j, this.UWI[i]);
        this.wellproduct(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i]);
        this.wellproject(this.wellinfo[i], this.wellOrder[i].toString() + j, this.UWI[i]);
      }



    }


  }

  wellmetainfo(wellname, wellorder, trackorder, uwi) {
    // well meta information
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const formgrp = d3.select('.uniq' + trackorder)
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
    
    d3.selectAll('.dropdown-menu li').on('click',this.trackaction)
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
      .attr('value', 'LAS' + trackorder);


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
      .attr('checked', 'checked');
    const Rasterlabel = RasterRadioDiv.append('label')
      .attr('class', 'custom-control-label')
      .attr('for', 'inlineRadioRaster' + trackorder + "raster")
      .html('Raster');

  }

  wellproject(wellname, trackorder, uwi) {
    const WellInfoproductDiv = d3.select('#foreignObject' + trackorder).append('xhtml:div')
      .attr('class', 'well-info-product')
      .attr('id', 'well-info-product' + trackorder);
    const LasDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control lasdropdown lasdropdown' + trackorder)
      .style('display', 'none');
    LasDropDown.append('option');

    const RasterDropDown = WellInfoproductDiv.append('div')
      .attr('class', 'form-group')
      .append('select')
      .attr('class', 'form-control rasterdropdown rasterdropdown' + trackorder)
      .style('display', 'block');
    RasterDropDown.append('option');
  }

 trackaction(wellorder, trackorder){
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


}
