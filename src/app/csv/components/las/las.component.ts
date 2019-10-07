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
  //trackHeight: any = document.querySelector('.chartGrp').getBoundingClientRect().height +document.querySelector('.wellgroup').getBoundingClientRect().height;
  constructor(private _dataService: GetcrosssectionsService) { }

  ngOnInit() {
  }
  createLasChartOnLoad(trackorder,uwi,productType,selectedTrack) {

    //    const formgrp = d3.select('.uniq' + trackorder).append('g').append('rect');
    console.log(this.lasCurveData.curveInformation);
    console.log(this.lasCurveData);
    console.log(selectedTrack.selectedCurve)
   // var curvename = selectedTrack;


    //this._dataService.getLasData(selectedTrack.uwi, selectedTrack.selectedCurve).subscribe(data => {

      
    this._dataService.getLasData(uwi,productType,selectedTrack).subscribe(data => {
      this.lasCurveData = data;

      var lasHeight = (d3.select('svg').attr('height') - d3.select('.wellgroup').attr('height')) - 20;
      if (selectedTrack != "") {
        if (Object.keys(data).length !== 0) {
          this.lasCurveData = data;
          const xScale = d3.scaleLinear().domain(d3.extent(this.lasCurveData[0].selectedProductData, function (d) { return d[0] })).nice().range([0, 200]); // Xaxis Scale
          const yScale = d3.scaleLinear().domain([d3.max(this.lasCurveData[0].selectedProductData, function (d) { return d[1] }), d3.min(this.lasCurveData[0].selectedProductData, function (d) { return d[1] })]).range([lasHeight-10, 0]); // Yaxis Scale

          const xAxis = d3.axisTop(xScale).tickSize(-(lasHeight-10)).ticks(6); // Xaxis 
          const yAxis = d3.axisLeft(yScale).tickSize(-200).ticks(6); // Y axis 
          const line = d3.line()
            .x(function (d) { return xScale(d[0]) })
            .y(function (d) { return yScale(d[1]) })
            .curve(d3.curveCardinal) // Cardinal graph generater
          const grp = d3.select('.uniq' + trackorder + ' g');
          //console.log(`.mainGrp${trackorder}`);
          const chartGroup1 = grp.append('rect')
            .attr('height', lasHeight + 32)
            .attr('width','250')
            .style('fill', 'white')
            .attr('transform', 'translate(0 ,148)');
          const chartGroup= grp.append('g').attr('class', 'chartGrp chartGrp' + trackorder)
            .attr('height', lasHeight -10)
            .style('background-color', '#fff')
            .attr('transform', 'translate(30 ,160)');
          // const cgrp = d3.select('chartGrp' +uwid + curveName);
          const grpXAxis = chartGroup.append('g').attr('class', 'axisred').attr('transform', 'translate(6,0)').transition()
          grpXAxis.call(xAxis);
          const grpYAxis = chartGroup.append('g').attr('class', 'axisred').attr('transform', 'translate(6,0)').transition()
          grpYAxis.call(yAxis);

          d3.select(`.uniq${trackorder} .loader`).remove();

          /// Drawing Path by sending Data points 
          chartGroup.append("path")
            .transition()
            .attr('transform', 'translate(11,2)')
            .attr("d", line(this.lasCurveData[0].selectedProductData))
            .attr('class', 'lasgrp')
            .attr('fill', 'none')
            .attr('stroke-width', 1)
            .attr('stroke', "blue")
          //console.log(document.querySelector('.wellgroup').getBoundingClientRect().height);

        }
      }
    })


  }


}
