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
    const loaderGrp = d3.select('.uniq'+ trackorder + ' g').append('g').attr('class', 'loader').attr('transform', 'translate(30 ,160)');
    loaderGrp.append('foreignObject').attr('width', '250')
      .attr('height', '150')
      .append('xhtml:div')
      .attr('class', 'fa-4x')
      .append('i')
      .attr('class', 'fas fa fa-spinner fa-spin')
  }

}
