import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
@Component({
  selector: 'app-las',
  templateUrl: './las.component.html',
  styleUrls: ['./las.component.scss']
})
export class LasComponent implements OnInit {
  private lasCurveData: any = [];
  constructor(private _dataService: GetcrosssectionsService) { }

  ngOnInit() {
  }
  title3 = "Las Components";
  createLasChartOnLoad(trackorder, selectedTrack,uwi) {
   
//    const formgrp = d3.select('.uniq' + trackorder).append('g').append('rect');
    console.log(this.lasCurveData.curveInformation);
    console.log(this.lasCurveData);
    console.log(selectedTrack.selectedCurve)
    var curvename = selectedTrack.selectedCurve;
    if(this.lasCurveData.curveInformation==""){
    //console.log(this.lasCurveData.curveInformation[1]);
    curvename = this.lasCurveData.curveInformation;
      d3.select(`.lasdropdown${trackorder}`).selectAll("option")
        .data(this.lasCurveData.curveInformation)
        .enter()
        .append("option")
        .attr("value", function (d, i) { return d })
        .text(function (d, i) { return d });
        //d3.selectAll(`.lasdropdown${trackorder}`+ ' > option[value *= "LAS_STD"').attr('selected', true);
    }

   
    
    //this._dataService.getLasData(selectedTrack.uwi, selectedTrack.selectedCurve).subscribe(data => {
      
      this._dataService.getLasData(uwi, curvename).subscribe(data => {
      this.lasCurveData = data;
      console.log(this.lasCurveData.curves);
      

      console.log(this.lasCurveData.curveInformation)

      d3.select(`.lasdropdown${trackorder}`).selectAll("option")
      .data(this.lasCurveData.curveInformation)
      .enter()
      .append("option")
      .attr("value", function (d, i) { return d })
      .text(function (d, i) { return d });
   
     
      if (Object.keys(data).length !== 0) {
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
        const chartGroup = grp.append('g').attr('class', 'chartGrp chartGrp' + trackorder).attr('transform', 'translate(30 ,160)');
        // const cgrp = d3.select('chartGrp' +uwid + curveName);
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
}
