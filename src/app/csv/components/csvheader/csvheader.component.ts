import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { GetcrosssectionsService } from '../../services/getcrosssections.service';
import { MessageService } from "../../../services/data-service.service";
import { CsvmapComponent } from 'src/app/map/csvmap/csvmap.component';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { CsvlayoutComponent } from '../csvlayout/csvlayout.component';

@Component({
  selector: 'app-csvheader',
  templateUrl: './csvheader.component.html',
  styleUrls: ['./csvheader.component.scss']
})
export class CsvheaderComponent implements OnInit{
  
  messages: any[] = [];
  message: any;
  @ViewChild(CsvmapComponent , { static: true }) mapreference;
  @Output() CreateCross = new EventEmitter();
  wellCount: any = 0;
  
  subscription: Subscription;

  constructor(
    private createCrossSectionService: GetcrosssectionsService,
    private mapComponent: CsvmapComponent,
    private messageService: MessageService
  ) { 
    // this.subscription = this.messageService.getMessage().subscribe(message => {
    //   if (message) {
    //     this.messages.push(message);
    //   } else {
    //     // clear messages when empty message received
    //     this.messages = [];
    //   }
    // });

  }
  @Input() wellCount1: Number;
  ngOnInit() {
    this.messageService.currentmessageService.subscribe(msg => this.message = msg);
    //var data =this.dataService.currentMessage.subscribe(message => this.message = message);
    //console.log("get", this.message);
    
  }
  
  onChooseview($event) {
    const viewSection = $event.srcElement.innerHTML;
    if (viewSection == "MAP") {
      document.getElementById('map-section').style.display = "block";
      document.getElementById('csv-section').style.display = "none";
      d3.select('#mapbtn').attr('class', 'btn btn-secondary activebtn')
      d3.select('#csvbtn').attr('class', 'btn btn-secondary ')
       d3.select('svg').remove();
       var mapdata = this.message;
       console.log(mapdata);
       //document.getElementById("wellmappane").style.display = "none";
       document.getElementById("wellpanelupdate").click();
       document.getElementById("btnUpdateWellOrder").click();
       //
       
      // localStorage.clear();
    }
    else {
      //this.mapreference.wellList;
      //this.mapreference.wellList;
      //var mapdata = JSON.parse(localStorage.getItem('welllist'));
      var mapdata = this.message;
      console.log(mapdata)
     
      //this.messageService.sendMessage(this.messages[0]);
      //this.dataService.currentMessage.subscribe(message => this.message = message);
      //console.log(this.message)
     // var mapdata = this.mapreference.wellList;
    //  var data =this.dataService.currentMessage.subscribe(message => this.message = message);
    //  console.log("get", this.message);
    //  console.log(data);
      //CsvmapComponent.
      // console.log(mapdata);
     
       var wellList = [];
      if (mapdata !=="") {
        d3.select('.csvspinner').style('display','block');
        mapdata.forEach(well => {
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
      }
      document.getElementById('map-section').style.display = "none";
      document.getElementById('csv-section').style.display = "block";
      d3.select('#csvbtn').attr('class', 'btn btn-secondary activebtn')
      d3.select('#mapbtn').attr('class', 'btn btn-secondary ')
      // this.messageService.sendnewMessage("hello");
     


    }
  }
  
}
