/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { useAudioStore } from "./store/audioStore";
import { Button } from "../ui/button";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { useOptionsStore } from "./store/optionsStore";

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
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center z-30 absolute bg-black inset-0">
      <progress id="interface-loader" max={100} value={progress}></progress>
    </div>
  );
}

function LoadError() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-black inset-0">
      <p className="text-slate-200 text-3xl text-center">
        Error Loading Presentation File.
      </p>
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
  handleMouseClick,
  handleMouseMove
}: {
  handleMouseClick: (e: any) => void;
  handleMouseMove: () => void;
}) {
  const slideContainer = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const { isMobilePhone, fullScreenShow } = useContext(PresentationContext);
  const setSwiperRef = useSlideStore((state) => state.setSwiperRef);
  const presentation = usepresentationStore(
    (state) => state.currentPresentation
  );
  const orientation = useOrientation();
  const fileDownloadProgress = usepresentationStore(
    (state) => state.loadProgress
  );

  const { height: windowHeight } = useWindowSize();
  const hide = useAudioStore((state) => state.screenShareEnabled);
  const screenShareMinimized = useAudioStore(
    (state) => state.screenShareMinimized
  );
  const iAmScreenSharing = useAudioStore((state) => state.iAmScreenSharing);
  const toogleScreenShare = useOptionsStore((state) => state.toggleScreenShare);

  const setPdfLoadingStatus = usepresentationStore(
    (state) => state.setLoadingStatus
  );
  const pdfLoadingStatus = usepresentationStore((state) => state.loadingStatus);

  useEffect(() => {
    // Update window height state when window is resized
    adjustWidth();
    window.addEventListener("resize", adjustWidth);
    return () => window.removeEventListener("resize", adjustWidth);
  }, []);

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
    setPdfLoadingStatus("loaded");
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
      className={cn("w-full h-full", hide && "!mt-0 overflow-y-hidden")}
      onClick={handleMouseClick}
      onMouseMove={handleMouseMove}
    >
      {(pdfLoadingStatus === "loading" ||
        pdfLoadingStatus === "loading-more") && (
        <FullScreenLoading progress={fileDownloadProgress} />
      )}

      {pdfLoadingStatus === "error" && <LoadError />}

      {iAmScreenSharing && (
        <div className="w-full aspect-video flex items-center justify-center z-30 bg-[#E7E7E7] border border-white">
          <div className="bg[#FFFFDB] border border-[#FF7A00] bg-[#FFFFDB] flex flex-col items-center justify-center p-5 gap-5 rounded-lg">
            <p>Your screen Is currently being shared</p>
            <Button onClick={toogleScreenShare}><MdOutlineStopScreenShare /> Stop Sharing</Button>
          </div>
        </div>
      )}

      {!iAmScreenSharing &&  (<div
        id="video-container"
        className={cn(
          "w-full aspect-video hidden",
          hide && !screenShareMinimized && "block",
          orientation.type.includes("portrait") && "mt-20"
        )}
      ></div>)}
      <Document
        file={presentation?.pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        error={<LoadError />}
        className={cn(
          orientation.type.includes("portrait") && "mt-20",
          hide && !screenShareMinimized && "hidden"
        )}
      >
        <swiper-container
          ref={setSwiperRef}
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
