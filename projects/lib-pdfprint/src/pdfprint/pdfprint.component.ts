/**
 * Owner : SIRAJUDDIN AHAMMED (siraj.home@gmail.com)
 * MIT Licence
 * required librabry : pdf.js by Mozilla (MIT)
 * Typescript code in this page
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as PDFJS from '../assets/pdfjs-2.0.943-dist/build/pdf.js';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdfprint',
  templateUrl: './pdfprint.component.html',
  styleUrls: ['./pdfprint.component.css'],
})
export class PdfprintComponent implements OnInit, AfterViewInit {

  PDF: any; // pdf input in base64 or blob url
  readonly canvas_ID = 'canvasPDF_';
  isPortraitPage = false;
  isLandscapePage = false;
  renderError = false;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {

    // this.PDF = 'JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==';
    // this.pdfInit('BASE64'.toUpperCase());

    this.PDF = 'http://www.africau.edu/images/default/sample.pdf';

    this.PDF = this.getlink(this.PDF);
    console.log(this.PDF);

    // this.pdfInit('BLOB'.toUpperCase());

  }

  getlink(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngAfterViewInit() {
    this.pdfRenderCall();
  }

  pdfRenderCall() {
    setTimeout(() => {
      /*** timeout to wait for the rendering to start */
      if (this.PDF) {
        let page = 1;
        for (let i = 1; i <= 1; i++) {
          this.renderPdf(this.PDF, page, this.canvas_ID + i);
          page++;
        }
      }
    }, 1000);
  }

  donwloadPDF() {
    const a = <HTMLAnchorElement>document.getElementById('A_DOWNLOAD');
    a.style.display = 'none';
    a.href = this.PDF;
    a.download = 'print-pdf-file.pdf';
    a.click();
  }

  pdfInit(fileType: string) {
    /**
     * @param fileType as 'base64' or 'blob' ;
     * intialize the documents and segregate for Labels and PDF
     */
    switch (fileType) {
      case 'BASE64':
        if (this.PDF) {
          let temp_pdf = '';
          /*** create pdf file from base64 */
          temp_pdf = this.base64ToBLOB(this.PDF);
          /*** convert pdf files to canvas images to print */
          setTimeout(() => { this.convertPdf2Image(temp_pdf); }, 2000);
          this.PDF = temp_pdf;
        }
        break;
      case 'BLOB':
        this.convertPdf2Image(this.PDF);
        break;
      default:
        break;
    }

  }

  base64ToBLOB(b64Data) {
    /*** this fuctions convert the base54 encode to the blob url */
    const b64toBlob = (b64DataTemp, sliceSize = 512) => {
      const byteCharacters = atob(b64DataTemp);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      return blob;
    };
    /*** call the function to convert the base64 and create the blob url */
    const blob = b64toBlob(b64Data),
      blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  printPDF() {
    /*** callback method after the first print dialog box is closed to print the PDFs */
    if (this.PDF) {
      if (!this.isPortraitPage && this.isLandscapePage) {
        this.printPDFSupport('landscape');
      } else {
        this.printPDFSupport('portrait');
      }
    }
  }

  printPDFSupport(mode) {
    /** create the html to open and print the html page containing the pdf file as image */
    const pdf_cnvs = document.getElementById('PDF_CANVAS_DIV');
    this.renderError = false;
    if (pdf_cnvs ? !pdf_cnvs.innerHTML : 1) {
      const pdf = this.PDF;
      this.convertPdf2Image(pdf);
      this.renderError = true;
    } else {
      /**
       * opening the pdf file as images embeded to a html (open new window) is required
       */
      const myWindow = window.open('', '', 'width=50,height=50, top=0, left=0');
      const style = '<style type="text/css" media="print">' +
        '@page {size: ' + mode + '; margin: 0;}' +
        'html { background-color: #FFFFFF !important; margin: 0px; width: calc(100% - 0px); height: calc(100% - 0px);}' +
        'body { background-color: #FFFFFF !important; margin: 0px; width: calc(100% - 0px); height: calc(100% - 0px);} </style>'
      myWindow.document.write('<html><head><title>Print Documents</title>' + style +
        '</head><body>' + pdf_cnvs.innerHTML + '</body></html>');
      myWindow.document.close();
      myWindow.focus();
      myWindow.print();
      myWindow.close();
    }

  }

  renderPdf(urlsX, pageNumX, canvas_IDX) {
    /**
     * combine multiple pdf and render the same in a canvas
     */

    const urls = urlsX;
    const canvasID = canvas_IDX;
    const pageNum1 = pageNumX;

    /**
     * If absolute URL from the remote server is provided, configure the CORS header on that server.
     * Disable workers to avoid yet another cross-origin issue (workers need
     * the URL of the script to be loaded, and dynamically loading a cross-origin script does not work).
     */
    PDFJS.disableWorker = true;

    /**
     * In cases when the pdf.worker.js is located at the different folder than the
     * pdf.js's one, or the pdf.js is executed via eval(), the workerSrc property shall be specified.
     */
    PDFJS.workerSrc = './assets/js/pdfjs-2.0.943-dist/build/pdf.worker.js';  // check

    /**
     * @typedef {Object} PageInfo
     * @property {number} documentIndex
     * @property {number} pageNumber
     */
    const pdfPDF = [];
    /**
     * @property {PageInfo}
     */
    let current;
    let pageRendering = false;
    let pageNumPending = null;
    const scale = 1;
    const pageNum = pageNum1 ? pageNum1 : 1;
    const canvas = <HTMLCanvasElement>document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');
    const a4width = 770;  // viewport or canvas size

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
      pageRendering = true;
      current = getPageInfo(num);
      pdfPDF[current.documentIndex]
        .getPage(current.pageNumber).then(function (page) {
          let scaleResize = 1;
          let viewport = page.getViewport(scale);
          scaleResize = a4width / viewport.width;
          viewport = page.getViewport(scaleResize);  // with new size
          canvas.width = a4width;
          canvas.height = (viewport.height * a4width) / viewport.width;

          /*** Render PDF page into canvas context */
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          const renderTask = page.render(renderContext);
          /*** Wait for rendering to finish */
          renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
              /*** New page rendering is pending */
              renderPage(pageNumPending);
              pageNumPending = null;
            }
          });
        });
    }

    /**
     * @returns PageNumber
     */
    function getPageInfo(num) {
      let totalPageCount1 = 0;
      for (let docIdx = 0; docIdx < pdfPDF.length; docIdx++) {

        totalPageCount1 += pdfPDF[docIdx].numPages;
        if (num <= totalPageCount1) {
          return { documentIndex: docIdx, pageNumber: num };
        }
        num -= pdfPDF[docIdx].numPages;
      }

      return false;
    }

    function load() {
      /*** Load PDFs one after another */
      PDFJS.getDocument(urls).then(function (pdfDoc_) {
        pdfPDF.push(pdfDoc_);
        /*** Initial/first/given page rendering */
        renderPage(pageNum);
      });
    }

    load();
  }

  convertPdf2Image(url) {
    /**
     * render pdf for all the pages and include into canvas as image to print directly
     */
    let currentPage = 1;
    const pages = [], scale = 2, a4width = 2000, self = this;
    this.isPortraitPage = false;
    this.isLandscapePage = false;

    function draw() {
      /**
       * draw the final canvas image when all the pages are rendered
       */
      const canvas = [], img = [], ctx = [], pgbrk = [], divInner = [];
      const divParent = document.createElement('div');
      divParent.style.cssText = 'margin: 100px; width';
      divParent.style.display = 'none';   // required
      document.body.appendChild(divParent);
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; ' + 'flex-direction: column; width:' + a4width + 'px; overflow:hidden;';
      div.id = 'PDF_CANVAS_DIV';
      divParent.appendChild(div);

      for (let i = 0; i < pages.length; i++) {
        canvas[i] = document.createElement('canvas');
        ctx[i] = canvas[i].getContext('2d');
        divInner[i] = document.createElement('div');
        img[i] = document.createElement('img');
        img[i].id = 'IMG_CNVS_' + i;
        pgbrk[i] = document.createElement('span');

        canvas[i].width = pages[i].width;
        canvas[i].height = pages[i].height;
        ctx[i].putImageData(pages[i], 0, 0);
        img[i].src = canvas[i].toDataURL();
        pgbrk[i].style.cssText = 'page-break-after: always; width: 1px;';
        img[i].style.cssText = 'width:100%; height: auto;';
        divInner[i].style.cssText = 'width:' + a4width + 'px; height: auto;';
        /**
         * landscape and portrait mode handling
         */
        if ((canvas[i].width / canvas[i].height) < 1.15) {
          self.isPortraitPage = true;
        } else {
          self.isLandscapePage = true;
        }

        divInner[i].appendChild(img[i]);
        div.appendChild(divInner[i]);
        div.appendChild(pgbrk[i]);
      }
    }

    // PDFJS.disableWorker = true; // due to CORS
    PDFJS.getDocument(url).then(function (pdf) {
      getPage();
      function getPage() {
        /**
         * render/convert each page into page array (image) untill all are completed
         */
        pdf.getPage(currentPage).then(function (page) {
          const viewport = page.getViewport(scale);
          const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
          const renderContext = { canvasContext: ctx, viewport: viewport };
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          page.render(renderContext).then(function () {
            pages.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            if (currentPage < pdf.numPages) {
              currentPage++;
              getPage();
            } else {
              draw();
            }
          });
        });
      }
    });
  }
}

