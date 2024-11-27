/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect, lazy, Suspense, useRef } from "react";
import { useOrientation } from "react-use";
// import Header from "./Header";
// import Slider from "./Slider";
// import Controls from "./Controls";
import { PresentationContext } from "../../contexts/presentationContext";
import { LoadingAssetBig, LoadingAssetBig2 } from "../../assets/assets";
import { useRtmStore } from "./store/rtmStore";
import { useAudioStore } from "./store/audioStore";
import { Toaster } from "@/components/ui/toaster";
import { useModalStore } from "./store/modalStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
// import { motion } from "framer-motion";

const Header = lazy(() => import("./Header"));
const Slider = lazy(() => import("./Slider"));
const Controls = lazy(() => import("./Controls"));

let wakeLock: WakeLockSentinel | null = null;
let setTimerActive: any = null;

function Interface() {
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

  const isModalOpen = useModalStore((state) => state.isOpen);
  const showModalBottomAction = useModalStore(
    (state) => state.showBottomAction
  );
  const setIsModalOpen = useModalStore((state) => state.setIsOpen);
  const modalTitle = useModalStore((state) => state.title);
  const modalDescription = useModalStore((state) => state.description);
  const modalContent = useModalStore((state) => state.content);
  const modalIsLoading = useModalStore((state) => state.isLoading);
  const modalActionText = useModalStore((state) => state.actionText);
  const modalOnClose = useModalStore((state) => state.onClose);
  const modalOnSubmit = useModalStore((state) => state.onSubmit);

  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(function() {
    containerRef.current = document.body;
  }, []);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogOverlay className="backdrop-blur-sm bg-black/20" />
      <DialogContent className="border-[1px] border-[#FF8B1C] bg-[#FFFFDB] w-11/12 rounded-md ">
        <DialogHeader>
          <DialogTitle className="text-center">{modalTitle}</DialogTitle>
          <DialogDescription className="text-center">
            {modalDescription}
          </DialogDescription>
        </DialogHeader>

        {modalIsLoading ? (
          <div className="flex justify-center items-center">
            <LoadingAssetBig />
          </div>
        ) : (
          modalContent
        )}
        {!modalIsLoading && showModalBottomAction && (
          <DialogFooter className="sm:justify-center gap-4">
            <DialogClose asChild>
              <Button
                onClick={modalIsLoading ? () => {} : modalOnClose}
                className="bg-black hover:black/20"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={modalOnSubmit}
              className="bg-black hover:bg-white hover:text-black"
              autoFocus
            >
              {modalActionText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
      <div
        className={`bg-black w-full ${isMobilePhone && !orientation.type.includes("portrait") && "relative"}`}
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
              <p className="text-center text-white">
                Loading presentation interface...
              </p>
            </div>
          }
        >
          <Header actionsActive={actionsActive} />
          <Slider
            setIsLoaded={setIsLoaded}
            handleMouseMove={handleMouseMove}
            handleMouseClick={handleMouseClick}
          />

          {loaded && (
            <Controls
              actionsActive={actionsActive}
              containerRef={containerRef}
            />
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
    </Dialog>
  );
}

export default Interface;
