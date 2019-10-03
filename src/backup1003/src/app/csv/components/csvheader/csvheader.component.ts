import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { CsvmapComponent } from 'src/app/map/csvmap/csvmap.component'
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { CsvlayoutComponent } from '../csvlayout/csvlayout.component';
@Component({
  selector: 'app-csvheader',
  templateUrl: './csvheader.component.html',
  styleUrls: ['./csvheader.component.scss']
})
export class CsvheaderComponent implements OnInit {
  @Output() CreateCross = new EventEmitter();
  wellCount: any = 0;
  subscription: Subscription;
  constructor(
    private createCrossSectionService: GetcrosssectionsService,
    private mapComponent: CsvmapComponent
  ) { }
  @Input() wellCount1: Number;
  ngOnInit() {

  }
  onChooseview($event) {
    const viewSection = $event.srcElement.innerHTML;
    if (viewSection == "MAP") {
      document.getElementById('map-section').style.display = "block";
      document.getElementById('csv-section').style.display = "none";
      d3.select('#mapbtn').attr('class', 'btn btn-secondary activebtn')
      d3.select('#csvbtn').attr('class', 'btn btn-secondary ')
    }
    else {
      console.log(this.mapComponent.Wells)
      var wellList = [];
      this.mapComponent.Wells.forEach(well => {
        wellList.push(well.UWI);
      })
      var wellString = wellList.join(',');
      this.createCrossSectionService.CreateCrossSection(wellString).subscribe(data => {
        console.log(data)
        var dataSet = {
          data: JSON.stringify(data),
          flag: "CREATE"
        }
        this.CreateCross.emit(dataSet);
      })
      document.getElementById('map-section').style.display = "none";
      document.getElementById('csv-section').style.display = "block";
      d3.select('#csvbtn').attr('class', 'btn btn-secondary activebtn')
      d3.select('#mapbtn').attr('class', 'btn btn-secondary ')


    }
  }
}
