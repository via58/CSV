import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-csvloader',
  templateUrl: './csvloader.component.html',
  styleUrls: ['./csvloader.component.scss']
})
export class CsvloaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  getcsvLoader(trackorder){
    var loaderHeight = (d3.select('svg').attr('height') - d3.select('.wellgroup').attr('height')) - 50;
    const loaderGrp = d3.select('.uniq'+ trackorder + ' g').append('g')
    .attr('class', 'loader').attr('transform', 'translate(0 ,130)');
    loaderGrp.append('foreignObject').attr('width', '250')
      .attr('height', loaderHeight)
      .append('xhtml:div')
      .style('background','#fff')
      .style('height','100%')
      .attr('class', 'fa-4x')
      .append('i')
      .attr('class', 'fas fa fa-spinner fa-spin')
  }

}
