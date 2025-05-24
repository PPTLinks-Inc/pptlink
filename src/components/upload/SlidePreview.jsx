/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "swiper/css";
import { register } from "swiper/element/bundle";
import { pdfjs, Document, Page } from "react-pdf";
import { useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/"
};

register();

export default function SlidePreview({ url, containerRef, currentView }) {
  const [numPages, setNumPages] = useState(0);
  const [fileDownloadProgress, setFileDownloadProgress] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);

  function adjustWidth() {
    const aspectRatio = 16 / 9; // Adjust this value to match the aspect ratio of your element
    let calculatedWidth = containerRef.current.offsetHeight * aspectRatio;;
    if (calculatedWidth > containerRef.current.offsetWidth) {
      calculatedWidth = containerRef.current.offsetWidth;
    }
    setMaxWidth(calculatedWidth);
  }

  useEffect(() => {
    // Update window height state when window is resized
    if (currentView !== 3) return;
    adjustWidth();
    const currentContainerRef = containerRef.current;
    currentContainerRef.addEventListener("resize", adjustWidth);
    return () => currentContainerRef.removeEventListener("resize", adjustWidth);
  }, [containerRef.current, currentView]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={url}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
      onLoadProgress={({ loaded, total }) =>
        setFileDownloadProgress((loaded / total) * 100)
      }
      loading={
        <div className="w-full h-full flex items-center justify-center">
          <progress id="upload-loader" className="w-full" max={100} value={fileDownloadProgress}></progress>
        </div>
      }
      error={<p className="w-full h-full flex items-center justify-center text-rose-500">Error Loading Presentation File</p>}
    >
      <swiper-container slides-per-view="1" navigation>
        {Array.from(new Array(numPages), (el, index) => (
          <swiper-slide key={`page_${index + 1}`}>
            <Page pageNumber={index + 1} width={maxWidth} />
          </swiper-slide>
        ))}
      </swiper-container>
    </Document>
  );
}
