/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useState, useContext, useEffect } from "react";
import { useOrientation } from "react-use";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Slider from "./Slider";
import Controls from "./Controls";
import { PresentationContext } from "../../contexts/presentationContext";

let wakeLock = null;
let setTimerActive = null;

function Interface() {
  const ref = useRef(null);
  const [loaded, setIsLoaded] = useState(false);
  const [actionsActive, setActionsActive] = useState(true);
  const { isMobile } = useContext(PresentationContext);
  const orientation = useOrientation();

  const [status, setStatus] = useState({
    online: false,
    offline: false
  });

  const updateOnlineStatus = () => {
    setStatus((prevState) => ({
      ...prevState,
      online: navigator.onLine ? true : "null",
      offline: !navigator.onLine ? true : "null"
    }));
  };

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

  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(function () {
    function requireWakeLock() {
      try {
        if (wakeLock !== null && document.visibilityState === "visible") {
          wakeLock = navigator.wakeLock.request("screen").then((lock) => {
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

    handleMouseMove();

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
    }, 5000);
  }

  function handleMouseClick(e) {
    if (e.target.tagName !== "DIV") return;
    if (actionsActive) {
      setActionsActive(false);
      if (setTimerActive) {
        clearTimeout(setTimerActive);
      }
    } else {
      handleMouseMove();
    }
  }

  return (
    <div
      className={`bg-black w-full ${isMobile({ iphone: false }) && !orientation.type.includes("portrait") && "relative"}`}
      ref={ref}
    >
      <Header actionsActive={actionsActive} />
      <Slider
        setIsLoaded={setIsLoaded}
        handleMouseMove={handleMouseMove}
        handleMouseClick={handleMouseClick}
      />
      {loaded && <Controls containerRef={ref} actionsActive={actionsActive} />}
      {status.online === true ? (
        <div
          className={`text-center fixed bottom-0 transition-all duration-500 z-40 text-white w-full bg-green-500 font-bold px-2`}
        >
          Back online
        </div>
      ) : (
        status.offline === true && (
          <div
            className={`fixed bottom-0 text-center transition-all duration-500 z-50 text-white w-full bg-[#ff0000] font-bold px-2`}
          >
            No internet connection
          </div>
        )
      )}
      <ToastContainer />
    </div>
  );
}

export default Interface;
