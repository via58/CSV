import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import {CsvModule} from './csv/csv.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CsvModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
