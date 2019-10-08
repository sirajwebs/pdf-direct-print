import { SafePipe } from './safe.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PdfprintComponent } from './pdfprint.component';

@NgModule({
  declarations: [
    PdfprintComponent,
    SafePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [PdfprintComponent]
})
export class PdfprintModule { }
