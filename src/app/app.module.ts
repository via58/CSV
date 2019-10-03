import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CsvModule} from './csv/csv.module';

@NgModule({
  declarations: [
    AppComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CsvModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
