/**
 * Owner : SIRAJUDDIN AHAMMED (siraj.home@gmail.com)
 * MIT Licence
 * Typescript code in this page
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as PDFJS from '../assets/pdfjs-2.0.943-dist/build/pdf.js';

@Component({
  selector: 'app-pdfprint',
  templateUrl: './pdfprint.component.html',
  styleUrls: ['./pdfprint.component.css'],
})
export class PdfprintComponent implements OnInit, AfterViewInit {

  PDF_URL = 'application/pdf';
  docs = {
    'pdfArray': {}
  };
  pdf_ID = 'pdf_';
  canvas_ID = 'canvasPDF_';
  page_count_ID = 'page_count';
  cnDiv = 'PDF_CANVAS_DIV';
  totalPage = 0;
  pdfPagesArray = [];
  nonBrowserSupport = false;
  totalPDFpage = 0;
  isPortraitPage = false;
  isLandscapePage = false;

  constructor() { }

  ngOnInit() {
    this.nonBrowserSupport = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
    this.docsInit();
    // this.pdfRenderCall();
  }

  ngAfterViewInit() {
    this.pdfRenderCall();
  }

  pdfRenderCall() {
    /**
     * methods to render the combined pdf files and to get the first page of each files
     */
    let urls = '';
    try {
      urls = this.docs['pdfArray']['Doc'];
      this.pdfPagesArray = this.docs['pdfArray']['pdfFiles'] ?
        this.docs['pdfArray']['pdfFiles'] : [];
    } catch (error) { }

    setTimeout(() => {
      /**
       * timeout to wait for the rendering to start
       */
      let page = 1;
      if (this.pdfPagesArray) {
        for (let i = 1; i <= this.pdfPagesArray.length; i++) {
          if (urls.length) {
            this.renderPdf(urls, page, this.canvas_ID + i);
            page += this.pdfPagesArray[i - 1]['pageNo'];
          }
          if (i === this.pdfPagesArray.length) { this.totalPDFpage = page - 1; }
        }
      }
    }, 1000);
  }

  donwloadPDF(ref) {
    const urls = this.docs['pdfArray']['Doc'];
    const a = <HTMLAnchorElement>document.getElementById('A_DOWNLOAD');
    a.style.display = 'none';
    a.href = urls;
    a.download = ref + '_pdf_file.pdf';
    a.click();
  }

  docsInit() {
    /**
     * intialize the documents and segregate for Labels and PDF
     */
    const pdf = this.docs['pdfArray'];
    let temp_pdf = '';
    if (pdf['Doc']) {
      /**
       * create pdf file from base64
       */
      temp_pdf = this.base64ToBLOB(pdf['Doc'], this.PDF_URL);
      if (this.nonBrowserSupport) {
        /**
         * convert pdf files to canvas images to print in Mozilla firefox
         */
        setTimeout(() => { this.convertPdf2Image(temp_pdf); }, 2000);
      }
    }
    this.docs['pdfArray']['Doc'] = temp_pdf;
  }

  base64ToBLOB(b64Data, contentType1) {
    /**
     * this fuctions convert the base54 encode to the blob url
     */
    const b64toBlob = (b64Data1, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data1);
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
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };
    /**
     * call the function to convert the base64 and create the blob url
     */
    const blob1 = b64toBlob(b64Data, contentType1);
    const blobUrl = URL.createObjectURL(blob1);
    return blobUrl;
  }

  printPDF() {
    /**
     * callback method after the first print dialog box is closed to print the PDFs
     */
    const pdf = this.docs['pdfArray'];

    if (pdf['Doc']) {
      const iframe = <HTMLFrameElement>document.getElementById('PDF_IFRAME');
        /**
         * wait till printing msg showing is over
         */
        if (!this.nonBrowserSupport) {
          iframe.contentWindow.print();
        } else {
          /**
           * catch if error occured in browser like Mozilla and IE
           */
          if (!this.isPortraitPage && this.isLandscapePage) {
            this.printPDFSupport('landscape');
          } else {
            this.printPDFSupport('portrait');
          }
        }
    }
  }

  printPDFSupport(mode) {
    /**
     * create the html to open and print the html page containing the pdf file as image
     */
    const pdf_cnvs = document.getElementById(this.cnDiv);
    if (pdf_cnvs ? !pdf_cnvs.innerHTML : 1) {
      const pdf = this.docs['pdfArray'];
      this.convertPdf2Image(pdf['Doc']);
      document.getElementById('dwnld_pdfLink').click();
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
    const pdfDocs = [];
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
      pdfDocs[current.documentIndex]
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
     * If another page rendering in progress, waits until the rendering is
     * finished. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    /**
     * @returns PageNumber
     */
    function getPageInfo(num) {
      let totalPageCount1 = 0;
      for (let docIdx = 0; docIdx < pdfDocs.length; docIdx++) {

        totalPageCount1 += pdfDocs[docIdx].numPages;
        if (num <= totalPageCount1) {
          return { documentIndex: docIdx, pageNumber: num };
        }
        num -= pdfDocs[docIdx].numPages;
      }

      return false;
    }

    function load() {
      /*** Load PDFs one after another */
      PDFJS.getDocument(urls).then(function (pdfDoc_) {
        pdfDocs.push(pdfDoc_);
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
      const canvas = [], img = [], ctx = [], pgbrk = [], divInner = [], cnDiv = 'PDF_CANVAS_DIV';
      const divParent = document.createElement('div');
      divParent.style.cssText = 'margin: 100px; width';
      divParent.style.display = 'none';   // required
      document.body.appendChild(divParent);
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; ' + 'flex-direction: column; width:' + a4width + 'px; overflow:hidden;';
      div.id = cnDiv;
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

