import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';


@Component({
  selector: 'app-raster',
  templateUrl: './raster.component.html',
  styleUrls: ['./raster.component.scss']
})
export class RasterComponent implements OnInit {
  private rasterimgData: any = [];
  constructor(private _dataService: GetcrosssectionsService) { }

  ngOnInit() {
  }

  createRasterChartOnLoad(uwi, TrackInformation, trackorder) {
    // alert(trackorder);
    this._dataService.getRasterData(uwi).subscribe(rasterData => {

      this.rasterimgData = rasterData;

      if (this.rasterimgData) {


        d3.select(`.rasterdropdown${trackorder}`).selectAll("option")
        .data(this.rasterimgData.SIFDataset.curveList)
        .enter()
        .append("option")
        .attr("value", function (d, i) { return d })
        .text(function (d, i) { return d });

        console.log(this.rasterimgData.SIFDataset.Header.Top_x0020_Depth)
        const rasterGroup = d3.select('.uniq' + trackorder + ' g').append('g').attr('class', 'rasterGrp rasterGrp' + trackorder).attr('transform', 'translate(0,150)');


        var rasterImg = rasterGroup.append('foreignObject')
          .attr('width', '250')
          .attr('height', '280')
        const rasterDiv = rasterImg.append('xhtml:div')
          .attr('class', 'rastergrp imggrp')
          // .attr('title', tooltipInfo)
          .append('img')
          .attr('src', 'http://localhost:9900/getRaster/getRasterImage?uwid=' + `${uwi}`)
          .attr('class', 'imgsize')

        //Yscale for raster Image start
        var data = [this.rasterimgData.SIFDataset.Header.Top_x0020_Depth, this.rasterimgData.SIFDataset.Header.Base_x0020_Depth];
        const yscale = d3.scaleLinear().domain([d3.min(data), d3.max(data)]).range([0, 280]);
        const yAxis = d3.axisLeft(yscale).ticks(10); // Y axis    
        rasterGroup.append('g')
          .attr('transform', 'translate(45,0)')
          .attr('class', 'axisred')
          .call(yAxis);
        //Yscale for raster Image End
        d3.select(`.uniq${trackorder} .loader`).remove();

      }
    })



  }

}
