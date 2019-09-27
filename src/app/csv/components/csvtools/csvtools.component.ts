import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import * as d3 from 'd3';


@Component({
  selector: 'app-csvtools',
  templateUrl: './csvtools.component.html',
  styleUrls: ['./csvtools.component.scss']
})
export class CsvtoolsComponent implements OnInit {
  selectedCrossSectionId: any;
  disableLoadButton = "disabled"; //initially button is enabled
  CrossSectionList = [];
  @Output() LoadCross = new EventEmitter();
  constructor(private crossSectionDetails: GetcrosssectionsService) { }

  ngOnInit() {
    this.createCrossSection();
  }

  enableLoadButton() {
    this.disableLoadButton = "";
  }
  createCrossSection() {
    this.crossSectionDetails.getConfig()
      .subscribe(
        data => this.CrossSectionList = data
      )
    console.log(this.CrossSectionList)
  }


  LoadCrossSection() {
    if (document.querySelector('input[name=CrossSection]:checked') != null) {

      this.selectedCrossSectionId = d3.select('input[name=CrossSection]:checked').property('value');
      this.crossSectionDetails.getCrossSectionData(this.selectedCrossSectionId).subscribe(
        data => {
          if (data) {
            d3.select('.panel-heading').attr('class', ' panel-heading collapsed')
            d3.select('#bar').attr('class', 'collapse');
            d3.select('svg').remove();
            this.LoadCross.emit(JSON.stringify(data));

          }
        }
      )

    }
    console.log("Selected CrossSection " + this.selectedCrossSectionId)
  }

}
