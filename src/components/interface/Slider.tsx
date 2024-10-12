/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { register } from "swiper/element/bundle";
import { pdfjs, Document, Page } from "react-pdf";
import { useOrientation, useWindowSize } from "react-use";
import { PresentationContext } from "../../contexts/presentationContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "swiper/css";
import "./styles/style.css";
import { useSlideStore } from "./store/slideStore";
import { usepresentationStore } from "./store/presentationStore";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/"
};

register();

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "swiper-container": any;
      "swiper-slide": any;
    }
  }
}

function FullScreenLoading({ progress }: { progress: number }) {
  return (
    <div className="w-full h-screen flex items-center justify-center z-50 absolute bg-black inset-0">
      <progress id="interface-loader" max={100} value={progress}></progress>
    </div>
  );
}

function LoadError() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-black inset-0">
      <p className="text-slate-200 text-3xl text-center">Error Loading Presentation File.</p>
      <p className="text-slate-200 mt-5 text-center">
        This could be due to an outdated browser or a poor network connection.
      </p>
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
  handleMouseMove
}: {
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  handleMouseClick: (e: any) => void;
  handleMouseMove: () => void;
}) {
  const swiperRef = useRef<any>(null);
  const slideContainer = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [fileDownloadProgress, setFileDownloadProgress] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const { isMobilePhone, fullScreenShow } =
    useContext(PresentationContext);
  const setSwiperRef = useSlideStore((state) => state.setSwiperRef);
  const initSlide = useSlideStore((state) => state.init);
  const presentation = usepresentationStore((state) => state.presentation);
  const orientation = useOrientation();
  const file = useMemo(
    function () {
      return presentation?.pdfLink;
    },
    [presentation?.pdfLink]
  );
  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    // Update window height state when window is resized
    adjustWidth();
    window.addEventListener("resize", adjustWidth);
    return () => window.removeEventListener("resize", adjustWidth);
  }, []);

  useEffect(() => {
    if (!swiperRef.current) return;
    console.log("Setting swiper ref");
    setSwiperRef(swiperRef.current);
    initSlide();
  }, [swiperRef.current]);

  function adjustWidth() {
    const aspectRatio = 16 / 9; // Adjust this value to match the aspect ratio of your element
    let calculatedWidth = window.innerHeight * aspectRatio;
    if (calculatedWidth > window.innerWidth) {
      calculatedWidth = window.innerWidth;
    }
    setMaxWidth(calculatedWidth);
  }

  function onDocumentLoadSuccess({
    numPages: nextNumPages
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);
    setIsLoaded(true);
  }

  useEffect(
    function () {
      if (
        isMobilePhone &&
        orientation.type.includes("portrait") &&
        slideContainer &&
        fullScreenShow
      ) {
        if (slideContainer.current) {
          slideContainer.current.style.marginTop =
            Math.floor(((windowHeight / 2) * 100) / windowHeight) + 10 + "%";
        }
      } else if (
        isMobilePhone &&
        orientation.type.includes("portrait") &&
        slideContainer
      ) {
        if (slideContainer.current)
          slideContainer.current.style.marginTop =
            Math.floor(((windowHeight / 2) * 100) / windowHeight) + "%";
      } else {
        if (slideContainer.current)
          slideContainer.current.style.marginTop = "0";
      }
    },
    [isMobilePhone, orientation.type, windowHeight, fullScreenShow]
  );

  return (
    <div
      ref={slideContainer}
      className="w-full"
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        onLoadProgress={({ loaded, total }) =>
          setFileDownloadProgress((loaded / total) * 100)
        }
        loading={<FullScreenLoading progress={fileDownloadProgress} />}
        error={<LoadError />}
      >
        <swiper-container
          ref={swiperRef}
          slides-per-view="1"
          navigation={isMobilePhone ? false : true}
          keyboard="true"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <swiper-slide key={`page_${index + 1}`}>
              <Page pageNumber={index + 1} width={maxWidth} />
            </swiper-slide>
          ))}
        </swiper-container>
      </Document>
    </div>
  );
}
