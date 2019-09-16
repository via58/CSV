import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csvheader',
  templateUrl: './csvheader.component.html',
  styleUrls: ['./csvheader.component.scss']
})
export class CsvheaderComponent implements OnInit {
  wellCount:any  = 0;
  constructor() { }

  ngOnInit() {
    this.wellCount = 2
  }

   titlename = "csv header components";
}
