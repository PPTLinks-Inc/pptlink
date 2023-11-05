/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import SwiperMySlide from "./assets/carousel/Swiper";
import { FaExpand, FaChevronUp, FaSync } from "react-icons/fa";
import animation1 from "./assets/images/animation1.gif";
import animation2 from "./assets/images/animation2.gif";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CopyAllRounded from "@mui/icons-material/CopyAllOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Button } from "@mui/material";
import { LoadingAssetSmall, LoadingAssetSmall2 } from "../../../assets/assets";
import { isIOS } from "react-device-detect";

let stopFunction = false;
let navBar = false;
let wakeLock = null;

export const Carousel = ({
  nav,
  presentation,
  makeLive,
  socket,
  livePending,
  requestIndex,
  socketId,
}) => {
  const [active, setActive] = useState(false);
  const [enableFullscreen, setEnableFullScreen] = useState(false);
  const userRef = useRef();
  const { navbar, setNavbar, navItems } = nav;
  const [timer, setTimer] = useState(4000);
  const [syncButton, setSyncButton] = useState(true);
  const [status, setStatus] = useState({
    online: false,
    offline: false,
  });

  const swiperRef = useRef();

  const [specialMedia, setSpecialMedia] = useState({
    toggled: false,
    animation1: false,
    animation2: false,
  });

  const list = ["", "", "", ""];

  const removeSpecialMedia = async () => {
    if (specialMedia.toggled === true) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: false,
        animation2: false,
      }));

      toggleFullScreen();
    }
  };

  function toggleFullScreen() {
    const element = userRef.current;

    if (!isIOS && document.fullscreenEnabled) {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement &&
        !document.webkitCurrentFullScreenElement
      ) {
        // None of the elements are in full-screen mode, so enter full-screen
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitEnterFullScreen) {
          element.webkitEnterFullScreen();
        }
      } else {
        // An element is already in full-screen mode, so exit full-screen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        socket.connect();
      }
      setStatus((prevState) => ({
        ...prevState,
        online: navigator.onLine ? true : "null",
        offline: !navigator.onLine ? true : "null",
      }));
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    }
  }, []);

  if (status.online === true) {
    setTimeout(() => {
      setStatus((prevState) => ({
        ...prevState,
        online: false,
      }));
    }, 3000);
  }

  const debouncedFunctionLead = debounce(
    () => {
      setActive(true);
      // console.log('wait');
    },
    4000,
    { leading: true, trailing: false }
  );

  const debouncedFunctionTrail = debounce(() => {
    if (stopFunction) return;

    setActive(false);
  }, timer);

  const requireWakeLock = async () => {
    try {
      if (wakeLock !== null && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };
  const handleScreenOrientation = (e) => {
    if (e.matches) {
      setSpecialMedia((prev) => ({
        ...prev,
        animation1: false,
        animation2: true,
      }));
    } else if (!e.matches && window.innerWidth < 900) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: true,
        animation1: true,
      }));
    }
  };
  // check if window is mobile view
  useEffect(() => {
    if (window.innerWidth < 900) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: true,
        animation1: true,
      }));
    }

    handleScreenOrientation(window.matchMedia("(orientation: landscape)"));

    (async function () {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");

          document.addEventListener("visibilitychange", requireWakeLock);
        } else {
          console.log("not available");
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    })();

    window
      .matchMedia("(orientation: landscape)")
      .addEventListener("change", handleScreenOrientation);

    return () => {
      window
        .matchMedia("(orientation: landscape)")
        .removeEventListener("change", handleScreenOrientation);

      if (wakeLock) {
        document.removeEventListener("visibilitychange", requireWakeLock);
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, []);

  return (
    <>
      <div
        className={`carousel relative lg:h-[650px] w-[100%] overflow-y-hidden  mx-auto select-none  ${
          enableFullscreen && "h-full w-full rotate-90"
        }`}
        ref={userRef}
        onMouseMove={() => {
          debouncedFunctionLead(), debouncedFunctionTrail();
        }}
        onClick={() => {
          debouncedFunctionLead(), debouncedFunctionTrail();
        }}
      >
        {presentation.User === "HOST" && active && (
          <p
            className="max-w-full bg-[white]/10 backdrop-blur-md text-[white]/50 absolute z-[10] left-4 top-6 lg:hidden py-3 px-2 rounded-md md:max-w-sm flex justify-between "
            onClick={() => {
              navigator.clipboard &&
                navigator.clipboard.writeText(window.location.href);
              toast.success("Link Copied successfully");
            }}
          >
            <span>{window.location.href}</span> <CopyAllRounded />
          </p>
        )}

        <div className="carousel__track-container h-full relative">
          <ul className="h-full w-full flex relative ">
            <SwiperMySlide
              active={active}
              socket={socket}
              presentation={presentation}
              requestIndex={requestIndex}
              socketId={socketId}
              setSyncButton={setSyncButton}
              ref={swiperRef}
            />
          </ul>
        </div>
        <div
          className={`absolute lg:hidden z-20 top-6 right-6  ${
            active ? "block" : "hidden"
          }`}
        >
          {presentation.User === "HOST" && (
            <Button
              title={presentation.live ? "End live" : "Go live"}
              onClick={makeLive}
              className={`w-[140px] h-[40px] !text-slate-200 !rounded-xl space-x-2 ${
                presentation.live ? "!bg-rose-500/50" : " !bg-green-500/50"
              }`}
            >
              {livePending ? (
                <LoadingAssetSmall2 />
              ) : (
                <>
                  <p>{presentation.live ? "End live" : "Go live"}</p>
                  <RadioButtonCheckedIcon
                    className={`!text-3xl !text-slate-200`}
                  />
                </>
              )}
            </Button>
          )}
        </div>

        <nav
          className={`h-16 w-16 rounded-full bottom-12 right-12  z-30 fixed transition-all duration-500 ${
            navbar ? "" : "active"
          } ${active ? "block" : "hidden"}`}
          onMouseEnter={() => {
            stopFunction = true;
          }}
          onMouseLeave={() => {
            if (!navBar) {
              stopFunction = false;
            }
          }}
        >
          <ul
            className={`w-full h-full flex items-center justify-center select-none`}
          >
            <button
              title="Toggle fullscreen"
              aria-label="Toggle fullscreen"
              type="button"
              className={`absolute -left-14 z-50 rounded-full bg-black p-2 bottom-2 hover:bg-slate-400
            ${active ? "block" : "hidden"}
          `}
            >
              <FaExpand
                size="30px"
                onClick={() => toggleFullScreen()}
                className="text-slate-200"
              />
            </button>

            {/* sync button for viewers */}

            {presentation.User !== "HOST" && !syncButton && (
              <>
                <button
                  onClick={() => swiperRef.current?.syncSlide()}
                  title={syncButton ? "" : "Sync"}
                  className={`absolute -left-28 bottom-2 bg-black p-2 rounded-full z-50 hover:bg-slate-400  ${
                    syncButton ? "bg-black" : "bg-slate-400 "
                  } z-50`}
                >
                  <FaSync size="28px" className="text-slate-200" />
                </button>
                <div
                  style={{
                    animationDelay: "-1s",
                  }}
                  className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
                ></div>
                <div
                  style={{
                    animationDelay: "-2s",
                  }}
                  className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
                ></div>
                <div
                  style={{
                    animationDelay: "-3s",
                  }}
                  className="pulsing__animation aspect-square absolute bg-slate-400 w-11 h-11  rounded-full -left-28 bottom-2  "
                ></div>
              </>
            )}
            <button
              onClick={() => {
                stopFunction = !stopFunction;
                setNavbar((prev) => !prev);
                navBar = !navBar;
                console.log(stopFunction);
              }}
              className={`text-slate-200 text-2xl rounded-full border active:scale-75 duration-200 border-white bg-black flex items-center z-20 justify-center w-full h-full active:bg-slate-200 transition-all select-none ${
                navBar ? "rotate-180" : "rotate-0"
              }`}
            >
              <FaChevronUp />
            </button>
            {navItems.map(({ icon, link, name }, i) => (
              <li
                key={i}
                className={`absolute w-[80%] rounded-full p-2 h-[80%] bg-black z-10 text-slate-200 border border-white transition-all  duration-500 ${
                  navbar && "duration-300"
                }`}
                style={{
                  transform: navbar
                    ? `translatey(-${(i + 1.1) * 100 + (i + 1) * 8}%)`
                    : "translateY(0)",
                  transitionDelay: `${(i + 1) / 10}s`,
                  zIndex: navItems.length - (i + 1),
                }}
              >
                <a
                  href={name === "download" ? presentation.pptLink : link}
                  className="w-full relative h-full flex items-center  justify-center flex-row-reverse"
                  download={name === "download" && presentation.name}
                >
                  <span className="">{icon}</span>
                  <span
                    className={`text-white absolute right-[calc(100%+1rem)] rounded-md p-2 shadow-md transition-all border-white border ${
                      navBar ? "opacity-100" : "opacity-0"
                    } duration-500 font-bold bg-black`}
                  >
                    {name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ToastContainer />
        {status.online === true ? (
          <div
            className={`online text-center absolute bottom-0 transition-all duration-500 z-40  text-white w-full bg-green-500 font-bold px-2  translate-y-4 opacity-0`}
          >
            {" "}
            Back online{" "}
          </div>
        ) : (
          status.offline === true && (
            <div
              className={`offline absolute bottom-0 text-center transition-all duration-500 z-40  text-white w-full bg-[#ff0000] font-bold px-2  translate-y-4 opacity-0`}
            >
              No internet connection
            </div>
          )
        )}
      </div>

      {specialMedia.toggled && (
        <div className="w-full h-screen fixed top-0 left-0 bottom-0 bg-black z-50">
          {specialMedia.animation1 && (
            <div className="w-full h-full grid place-content-center">
              <div className="w-fit h-fit flex flex-col justify-between">
                <img src={animation1} alt="animation image" />

                <p className="text-slate-200">Rotate to landscape mode</p>
              </div>
            </div>
          )}

          {!specialMedia.animation1 && specialMedia.animation2 && (
            <div className="w-full h-full grid place-content-center">
              <div className="w-fit h-fit flex flex-col justify-between">
                <FaExpand
                  onClick={removeSpecialMedia}
                  className="absolute text-slate-200 text-[70px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                />

                <img
                  src={animation2}
                  alt="animation image"
                  className="mt-[3rem] ml-[1.5rem] z-10 pointer-events-none"
                />

                <p className="text-slate-200">Click to make full screen</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
