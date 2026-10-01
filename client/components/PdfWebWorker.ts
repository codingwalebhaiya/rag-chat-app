import { Document, Page, pdfjs } from 'react-pdf';

// Configure the worker using the CDN version matching your package version
pdfjs.GlobalWorkerOptions.workerSrc = `//://unpkg.com{pdfjs.version}/build/pdf.worker.min.mjs`;
