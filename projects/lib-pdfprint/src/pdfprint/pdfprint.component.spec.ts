import { TestBed, async } from '@angular/core/testing';
import { PdfprintComponent } from './pdfprint.component';
describe('PdfprintComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PdfprintComponent
      ],
    }).compileComponents();
  }));
  it('should create the pdfprint', async(() => {
    const fixture = TestBed.createComponent(PdfprintComponent);
    const pdfprint = fixture.debugElement.componentInstance;
    expect(pdfprint).toBeTruthy();
  }));
  it(`should have as title 'pdfprint'`, async(() => {
    const fixture = TestBed.createComponent(PdfprintComponent);
    const pdfprint = fixture.debugElement.componentInstance;
    expect(pdfprint.title).toEqual('pdfprint');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(PdfprintComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to pdfprint!');
  }));
});
