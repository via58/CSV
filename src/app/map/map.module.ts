import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvmapComponent } from './csvmap/csvmap.component';

@NgModule({
  declarations: [
  CsvmapComponent],
  imports: [
    CommonModule
  ],
  providers: [],
  exports:[
    CsvmapComponent
  ]
})
export class MapModule { }

