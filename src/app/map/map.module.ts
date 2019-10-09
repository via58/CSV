import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvmapComponent } from './csvmap/csvmap.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MessageService } from "../services/data-service.service";


@NgModule({
  declarations: [
  CsvmapComponent],
  imports: [
    CommonModule, 
     DragDropModule,
     
  ],
  providers: [MessageService],
  exports:[
    CsvmapComponent
  ]
})
export class MapModule { }

