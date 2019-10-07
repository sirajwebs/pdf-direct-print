import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PdfprintModule } from 'pdfprint';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PdfprintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
