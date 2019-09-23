import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvheaderComponent } from './components/csvheader/csvheader.component';
import { WellmetadataComponent } from './components/wellmetadata/wellmetadata.component';
import { LasComponent } from './components/las/las.component';
import { RasterComponent } from './components/raster/raster.component';
import { CsvloaderComponent } from './components/csvloader/csvloader.component';
import { CsvtoolsComponent } from './components/csvtools/csvtools.component';
import { OpencsvComponent } from './components/opencsv/opencsv.component';

//import {GetcrosssectionsService} from './services/getcrosssections.service';
import {GetCrossSectionDetailsService} from './services/get-cross-section-details.service';
//import {CsvdataService} from './services/csvdata.service';
import { CsvlayoutComponent } from './components/csvlayout/csvlayout.component'
import { MapModule } from '../map/map.module';
import { GetcrosssectionsService } from './services/getcrosssections.service';




@NgModule({
  declarations: [
    CsvheaderComponent, 
    WellmetadataComponent, 
    LasComponent, 
    RasterComponent, 
    CsvloaderComponent, 
    CsvtoolsComponent, 
    OpencsvComponent, CsvlayoutComponent
  ],
  imports: [
    CommonModule,
    MapModule
  ],
  providers: [GetCrossSectionDetailsService,GetcrosssectionsService],
  exports:[
    CsvheaderComponent, 
    WellmetadataComponent, 
    LasComponent, 
    RasterComponent, 
    CsvloaderComponent, 
    CsvtoolsComponent, 
    OpencsvComponent
  ]
})
export class CsvModule { }
