/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { register } from "swiper/element/bundle";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "swiper/css";
import "./styles/style.css";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";

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
    <div className="w-full h-screen flex flex-col gap-5 items-center justify-center z-30 absolute bg-primaryTwo inset-0">
      <progress id="interface-loader" max={100} value={progress}></progress>
    </div>
  );
}

function LoadError() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center z-50 absolute bg-primaryTwo inset-0">
      <p className="text-slate-200 text-3xl text-center">
        Error Loading Presentation File.
      </p>
      <p className="text-slate-200 mt-5 text-center">
        This could be due to an outdated browser or a poor network connection.
      </p>
      <button
        className="bg-slate-200 text-primaryTwo p-3 mt-3 rounded-md"
        onClick={() => location.reload()}
      >
        Reload
      </button>
    </div>
  );
}

export default function Slider() {
  const params = useParams();
  const navigate = useNavigate();

  const { userQuery } = useUser();
  const user = userQuery.data;

  const [swiperRef, setSwiperRef] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<any>(null);
  const viewedPages = useRef<any>(new Set());

  const { data } = useSuspenseQuery({
    queryKey: ["presentation", user?.id, params.courseId, params.contentId],
    queryFn: async function () {
      const { data } = await authFetch.get(
        `/api/v1/course/media/ppt/${params.courseId}/${params.contentId}`
      );

      return data.presentation;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const [numPages, setNumPages] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    // Update window height state when window is resized
    adjustWidth();
    window.addEventListener("resize", adjustWidth);
    return () => window.removeEventListener("resize", adjustWidth);
  }, []);

  useEffect(() => {
    // Adjust width when the component mounts
    let timer: any = null;

    function handleSlideChange() {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        viewedPages.current.add(swiperRef?.swiper.activeIndex);
        timer = null;
      }, 1000);
    }
    if (swiperRef) {
      // change slide to a particular page
      swiperRef?.swiper.slideTo(data?.progress ?? 0);

      swiperRef?.addEventListener("swiperslidechange", handleSlideChange);

      intervalRef.current = setInterval(async () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
          await authFetch.patch(
            `/api/v1/course/media/ppt-analytics/${params.courseId}/${params.contentId}`,
            {
              watchedBlocks: Array.from(viewedPages.current),
              lastPosition: swiperRef?.swiper.activeIndex
            },
            {
              signal: abortControllerRef.current.signal
            }
          );
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Error updating ppt analytics:", error);
          }
        }
      }, 15000);
    }

    return () => {
      if (swiperRef) {
        swiperRef.removeEventListener("swiperslidechange", handleSlideChange);
      }
      if (timer) {
        clearTimeout(timer);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [swiperRef]);

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
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="w-full p-4 bg-gray-800 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="hover:text-gray-300">
            <FaArrowLeft size={20} />
          </button>
          <p className="md:w-full w-10/12 truncate">{data.name}</p>
        </div>

        {data.User === "HOST" && (
          <Button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded">
            Start Live Session
          </Button>
        )}
      </header>
      <Document
        file={data.pdfLink}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        error={<LoadError />}
        onLoadProgress={({ loaded, total }) => {
          const progress = (loaded / total) * 100;
          setLoadingPercentage(progress);
        }}
        loading={<FullScreenLoading progress={loadingPercentage} />}
      >
        <swiper-container
          ref={setSwiperRef}
          slides-per-view="1"
          keyboard="true"
          navigation="true"
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
