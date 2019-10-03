import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvmapComponent } from './csvmap/csvmap.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
  CsvmapComponent],
  imports: [
    CommonModule, 
     DragDropModule 
  ],
  providers: [],
  exports:[
    CsvmapComponent
  ]
})
export class MapModule { }

