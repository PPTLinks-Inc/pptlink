/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { register } from "swiper/element/bundle";
import { pdfjs, Document, Page } from "react-pdf";
import { useOrientation } from "react-use";
import { PresentationContext } from "../../contexts/presentationContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "swiper/css";
import "./styles/style.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/"
};

register();

function FullScreenLoading({ progress }) {
  return (
    <div className="w-full h-screen flex items-center justify-center z-50 absolute bg-black inset-0">
      <progress max={100} value={progress}></progress>
    </div>
  );
}

function LoadError() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-black inset-0">
      <p className="text-slate-200">Error Loading Presentation File</p>
      <button
        className="bg-slate-200 text-black p-3 mt-3 rounded-md"
        onClick={() => location.reload()}
      >
        Reload
      </button>
    </div>
  );
}

export default function Slider({
  setIsLoaded,
  handleMouseClick,
  handleMouseMove,
}) {
  const swiperRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [fileDownloadProgress, setFileDownloadProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const { isMobile, presentation, setSwiperRef } = useContext(PresentationContext);
  const orientation = useOrientation();
  const file = useMemo(function() {
    return presentation.data.pdfLink
  }, [presentation.data.pdfLink]);

  useEffect(() => {
    // Update window height state when window is resized
    adjustWidth();
    window.addEventListener("resize", adjustWidth);
    return () => window.removeEventListener("resize", adjustWidth);
  }, []);

  useEffect(() => {
    if (!swiperRef.current) return;
    setSwiperRef(swiperRef.current);
  }, [swiperRef.current]);

  function adjustWidth() {
    const aspectRatio = 16 / 9; // Adjust this value to match the aspect ratio of your element
    let calculatedWidth = window.innerHeight * aspectRatio;
    if (calculatedWidth > window.innerWidth) {
      calculatedWidth = window.innerWidth;
    }
    setMaxWidth(calculatedWidth);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    setIsLoaded(true);
  }

  return (
    <div
      className={`w-full ${isMobile({ iphone: false }) && orientation.type.includes("portrait") && "mt-40"}`}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
    >
      {isError && <LoadError />}
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={() => setIsError(true)}
        options={options}
        onLoadProgress={({ loaded, total }) =>
          setFileDownloadProgress((loaded / total) * 100)
        }
        loading={<FullScreenLoading progress={fileDownloadProgress} />}
      >
        <swiper-container
          ref={swiperRef}
          slides-per-view="1"
          navigation="true"
          keyboard="true"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <swiper-slide key={`page_${index + 1}`}>
              <Page pageNumber={index + 1} width={maxWidth} />
            </swiper-slide>
          ))}
        </swiper-container>
      </Document>
    </div>
  );
}
