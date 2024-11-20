/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useState, useContext, useEffect, lazy, Suspense } from "react";
import { useOrientation } from "react-use";
// import Header from "./Header";
// import Slider from "./Slider";
// import Controls from "./Controls";
import { PresentationContext } from "../../contexts/presentationContext";
import { LoadingAssetBig2 } from "../../assets/assets";
import { useRtmStore } from "./store/rtmStore";
import { useAudioStore } from "./store/audioStore";
import { Toaster } from "@/components/ui/toaster";
// import { motion } from "framer-motion";

const Header = lazy(() => import("./Header"));
const Slider = lazy(() => import("./Slider"));
const Controls = lazy(() => import("./Controls"));

let wakeLock: WakeLockSentinel | null = null;
let setTimerActive: any = null;

function Interface() {
  const ref = useRef(null);
  const [loaded, setIsLoaded] = useState(false);
  const [actionsActive, setActionsActive] = useState(true);
  const { isMobilePhone, fullScreenShow } = useContext(PresentationContext);
  const orientation = useOrientation();

  const [status, setStatus] = useState({
    online: false,
    offline: false
  });

  const rtmConnectionState = useRtmStore((state) => state.status);
  const audioConnectionState = useAudioStore(
    (state) => state.audioConnectionState
  );

  useEffect(() => {
    if (status.online === true) {
      setTimeout(() => {
        setStatus((prevState) => ({
          ...prevState,
          online: false
        }));
      }, 3000);
    }
  }, [status]);

  useEffect(
    function () {
      if (rtmConnectionState === "CONNECTED") {
        setStatus({
          online: true,
          offline: false
        });
      } else if (
        rtmConnectionState === "RECONNECTING" ||
        rtmConnectionState === "DISCONNECTED" ||
        rtmConnectionState === "FAILED"
      ) {
        setStatus({
          online: false,
          offline: true
        });
      }
    },
    [rtmConnectionState]
  );

  useEffect(function () {
    function requireWakeLock() {
      try {
        if (wakeLock !== null && document.visibilityState === "visible") {
          navigator.wakeLock.request("screen").then((lock) => {
            wakeLock = lock;
          });
        }
      } catch (err) {
        //
      }
    }

    (async function () {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");

          document.addEventListener("visibilitychange", requireWakeLock);
        }
      } catch (err) {
        //
      }
    })();

    return () => {
      if (wakeLock) {
        document.removeEventListener("visibilitychange", requireWakeLock);
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, []);

  function handleMouseMove() {
    setActionsActive(true);
    if (setTimerActive) {
      clearTimeout(setTimerActive);
    }

    setTimerActive = setTimeout(() => {
      setActionsActive(false);
    }, 4000);
  }

  function handleMouseClick(e: any) {
    if (
      e.target.tagName === "DIV" ||
      e.target.tagName === "SPAN" ||
      e.target.tagName === "VIDEO"
    ) {
      if (actionsActive) {
        setActionsActive(false);
        if (setTimerActive) {
          clearTimeout(setTimerActive);
        }
      } else {
        handleMouseMove();
      }
    }
  }

  // const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`bg-black w-full ${isMobilePhone && !orientation.type.includes("portrait") && "relative"}`}
      ref={ref}
    >
      {audioConnectionState === "RECONNECTING" && (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-black">
          <LoadingAssetBig2 />
          <p className="text-white text-xl">Reconnecting Audio</p>
        </div>
      )}
      <Suspense
        fallback={
          <div className="flex flex-col justify-center items-center h-screen bg-black">
            <LoadingAssetBig2 />
            <p className="text-center text-white">Loading presentation interface...</p>
          </div>
        }
      >
        <Header actionsActive={actionsActive} />
        {/* <motion.div ref={constraintsRef} className="relative h-screen"> */}
        <Slider
          setIsLoaded={setIsLoaded}
          handleMouseMove={handleMouseMove}
          handleMouseClick={handleMouseClick}
        />

        {loaded && (
          <Controls containerRef={ref} actionsActive={actionsActive} />
        )}
      </Suspense>
      {status.online === true ? (
        <div
          className={`text-center fixed bottom-0 transition-all duration-500 z-40 text-white w-full bg-green-500 font-bold px-2`}
        >
          Back online
        </div>
      ) : (
        status.offline === true && (
          <div
            className={`fixed bottom-0 text-center transition-all duration-500 z-50 text-white w-full bg-rose-500 font-bold px-2`}
          >
            {rtmConnectionState}
          </div>
        )
      )}

      {fullScreenShow && <Toaster />}
    </div>
  );
}

export default Interface;
