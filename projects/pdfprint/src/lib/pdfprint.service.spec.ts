import { TestBed } from '@angular/core/testing';

import { PdfprintService } from './pdfprint.service';

describe('PdfprintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfprintService = TestBed.get(PdfprintService);
    expect(service).toBeTruthy();
  });
});
