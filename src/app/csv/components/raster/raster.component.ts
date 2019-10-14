import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { CsvloaderComponent } from '../csvloader/csvloader.component';
import { YscaleService } from "../../../services/data-scale.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-raster',
  templateUrl: './raster.component.html',
  styleUrls: ['./raster.component.scss']
})
export class RasterComponent implements OnInit {
  private rasterimgData: any = [];
  yscale : any;
  @ViewChild(CsvloaderComponent, { static: true }) loadercomp;
  constructor(private _dataService: GetcrosssectionsService, private yscaleService: YscaleService) { }

  ngOnInit() {
    this.yscaleService.currentyscaleService.subscribe(msg => this.yscale = msg);
    console.log(this.yscale);
  }


  createRasterChartOnLoad(trackorder, uwi, productType, curveName, segment) {

    if (curveName == "" || curveName =="--Select Curve--") {
      d3.select(`.uniq${trackorder} .loader`).remove();
      d3.select(`.rasterdropdown${trackorder}`).property('selectedIndex', '0')

    } else {
      this._dataService.getRasterData(uwi, productType, curveName, segment).subscribe(rasterData => {

        this.rasterimgData = rasterData;

        if (this.rasterimgData) {

          var seg = this.rasterimgData[0].curveLists[productType].find(item => item.name === curveName);
          console.log(seg);
          const rasterSegment = d3.select('#well-info-project' + trackorder).append('div')
            .attr('class', 'form-group')
            .append('select')
            .attr('class', 'form-control rastersegment rastersegment' + trackorder)

          d3.select(`.rastersegment${trackorder}`).selectAll("option")
            .data(seg.segmentList)
            .enter()
            .append("option")
            .attr("value", function (d, i) { return d.segmentNumber })
            .text(function (d, i) { return d.displayText + " " +  d.topDepth + " " +  d.baseDepth});
          d3.select(`.rastersegment${trackorder}`).property('selectedIndex', '1')
          rasterSegment.on('change', function () {
            const dropval = d3.select(`.rastersegment${trackorder}`).node().value;
            const dropmaxval = d3.select(`.rastersegment${trackorder}`).node().value;
            const dropminval = d3.select(`.rastersegment${trackorder}`).node().value;

            this.rasterLoader(trackorder)

            d3.select(`.rasterGrp${trackorder}`).remove();
            this._dataService.getRasterData(uwi, productType, curveName, dropval).subscribe(rasterData => {


              const rasterGroup = d3.select('.uniq' + trackorder + ' g').append('g').attr('class', 'rasterGrp rasterGrp' + trackorder).attr('transform', 'translate(0,200)');

              console.log(d3.select('svg').attr('height'))
              console.log(d3.select('.wellgroup').attr('height'))
              var rasterHeight = (d3.select('svg').attr('height') - d3.select('.wellgroup').attr('height')) - 50;
              var rasterImg = rasterGroup.append('foreignObject')
                .attr('width', '250')
                .attr('height', rasterHeight + 10)
                .style('background-color', '#fff')
              const rasterDiv = rasterImg.append('xhtml:div')
                .attr('class', 'rastergrp imggrp')
              // .attr('title', tooltipInfo)
              d3.select(`.uniq${trackorder} .loader`).remove();
              if (rasterData[0].selectedProductFiles != "") {

                rasterDiv.append('img')
                  .attr('src', `data:image/jpeg;base64,${rasterData[0].selectedProductFiles}`)
                  .attr('class', 'imgsize')
                  .attr('height', rasterHeight)
                //console.log('data:image/jpeg;base64,' + rasterData[0].selectedProductFiles);

                //Yscale for raster Image start
                var data = [seg.topDepth, seg.baseDepth];
                const yscale = d3.scaleLinear().domain([this.yscale[0], this.yscale[1]]).range([0, rasterHeight]);
                const yAxis = d3.axisLeft(yscale).ticks(10); // Y axis    
                rasterGroup.append('g')
                  .attr('transform', 'translate(45,0)')
                  .attr('class', 'axisred')
                  .call(yAxis);
              } else {
                rasterDiv.html("No Segment Data Found")
                  .style('padding-top', '50px')
                  .style('padding-left', '30px')
                  .style('color', '#ff0000')
              }
            })
          }.bind(this))


          const rasterGroup = d3.select('.uniq' + trackorder + ' g').append('g').attr('class', 'rasterGrp rasterGrp' + trackorder).attr('transform', 'translate(0,200)');

          console.log(d3.select('svg').attr('height'))
          console.log(d3.select('.wellgroup').attr('height'))
          var rasterHeight = (d3.select('svg').attr('height') - d3.select('.wellgroup').attr('height')) - 50;
          var rasterImg = rasterGroup.append('foreignObject')
            .attr('width', '250')
            .attr('height', rasterHeight + 10)
            .style('background-color', '#fff')
          const rasterDiv = rasterImg.append('xhtml:div')
            .attr('class', 'rastergrp imggrp')
          // .attr('title', tooltipInfo)
          if (this.rasterimgData[0].selectedProductFiles != "") {

            rasterDiv.append('img')
              .attr('src', `data:image/jpeg;base64,${this.rasterimgData[0].selectedProductFiles}`)
              .attr('class', 'imgsize')
              .attr('height', rasterHeight)
            //console.log('data:image/jpeg;base64,' + this.rasterimgData[0].selectedProductFiles);
            //.attr('')

            //Yscale for raster Image start
            var data = [seg.topDepth, seg.baseDepth];
            const yscale = d3.scaleLinear().domain([this.yscale[0],this.yscale[1]]).range([0, rasterHeight]);
            const yAxis = d3.axisLeft(yscale).ticks(10); // Y axis    
            rasterGroup.append('g')
              .attr('transform', 'translate(45,0)')
              .attr('class', 'axisred')
              .call(yAxis);
          } else {
            rasterDiv.html("No Segment Data Found")
              .style('padding-top', '50px')
              .style('padding-left', '30px')
              .style('color', '#ff0000')


          }
          //Yscale for raster Image End
          d3.select(`.uniq${trackorder} .loader`).remove();



        }
      })
    }

  }


  rasterLoader(trackorder) {
    var loaderHeight = (d3.select('svg').attr('height') - d3.select('.wellgroup').attr('height')) - 50;
    const loaderGrp = d3.select('.uniq' + trackorder + ' g').append('g')
      .attr('class', 'loader').attr('transform', 'translate(0 ,200)');
    loaderGrp.append('foreignObject').attr('width', '250')
      .attr('height', loaderHeight)
      .append('xhtml:div')
      .style('background', '#fff')
      .style('height', '100%')
      .attr('class', 'fa-4x')
      .append('i')
      .attr('class', 'fas fa fa-spinner fa-spin')
  }

}
