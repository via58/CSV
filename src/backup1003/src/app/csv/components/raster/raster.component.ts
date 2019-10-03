import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { CsvloaderComponent } from '../csvloader/csvloader.component';

@Component({
  selector: 'app-raster',
  templateUrl: './raster.component.html',
  styleUrls: ['./raster.component.scss']
})
export class RasterComponent implements OnInit {
  private rasterimgData: any = [];
  @ViewChild(CsvloaderComponent, { static: true }) loadercomp;
  constructor(private _dataService: GetcrosssectionsService) { }

  ngOnInit() {
  }

  createRasterChartOnLoad(trackorder, uwi, productType, curveName, segment) {
    // alert(trackorder);
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
          .text(function (d, i) { return d.displayText });
        d3.select(`.rastersegment${trackorder}`).property('selectedIndex','1')
        rasterSegment.on('change', function () {
          const dropval = d3.select(`.rastersegment${trackorder}`).node().value;

          //this.loadercomp.getcsvLoader(trackorder)

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
            if (rasterData[0].selectedProductFiles != "") {

              rasterDiv.append('img')
                .attr('src', `data:image/jpeg;base64,${rasterData[0].selectedProductFiles}`)
                .attr('class', 'imgsize')
                .attr('height', rasterHeight)
              console.log('data:image/jpeg;base64,' + rasterData[0].selectedProductFiles);
              //.attr('')

              //Yscale for raster Image start
              var data = [seg.topDepth, seg.baseDepth];
              const yscale = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([0, rasterHeight]);
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
          console.log('data:image/jpeg;base64,' + this.rasterimgData[0].selectedProductFiles);
          //.attr('')

          //Yscale for raster Image start
          var data = [seg.topDepth, seg.baseDepth];
          const yscale = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([0, rasterHeight]);
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
