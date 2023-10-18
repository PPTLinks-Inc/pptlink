/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, useReducer, useState, forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, A11y, Keyboard, Zoom } from "swiper/modules";
import { FaSync } from "react-icons/fa";

import "swiper/swiper-bundle.css";

const state = {
  maxNext: 0,
  hostSlideIndex: 0,
  auto: false,
  sync: true,
};

function SwiperMySlide({
  active,
  socket,
  presentation,
  requestIndex,
  socketId,
  setSyncButton,
}) {
  const swiperRef = useRef();
  // const [syncButton, setSyncButton] = useState(false);
  let onEnter;
  if (window.innerWidth < 900) {
    onEnter = false;
  } else {
    onEnter = true;
  }

  const slideChange = (slide) => {
    if (socket.connected && presentation.User === "HOST") {
      socket.emit("change-slide", {
        liveId: presentation.liveId,
        currentSlide: slide.activeIndex,
        previousSlide: slide.previousIndex,
      });
    } else {
      if (slide.activeIndex > state.maxNext) {
        swiperRef.current.allowSlideNext = true;
        swiperRef.current.slideTo(state.maxNext, 0, false);
        swiperRef.current.allowSlideNext = false;
        return;
      }
      if (slide.activeIndex === state.maxNext) {
        swiperRef.current.allowSlideNext = false;
        state.sync = true;
        setSyncButton(true);
        return;
      }

      if (slide.activeIndex === state.hostSlideIndex) {
        state.sync = true;
        setSyncButton(true);
      }

      if (!state.auto) {
        state.sync = false;
        setSyncButton(false);
        swiperRef.current.allowSlideNext = true;
      }
    }
  };

  const syncSlide = () => {
    swiperRef.current.slideTo(state.hostSlideIndex, 1000, true);
  };

  useEffect(() => {
    if (socket.connected && presentation.User === "HOST") {
      socket.on("request-slide", (guestSocketId) => {
        socket.emit("send-request-slide", {
          guestSocketId,
          currentSlide: swiperRef.current.activeIndex,
        });
      });
    } else if (socket.connected && presentation.User !== "HOST") {
      if (requestIndex) {
        socket.emit("request-slide", {
          hostSocketId: presentation.hostSocketId,
          guestSocketId: socketId,
        });

        socket.on("receive-request-id", (currentSlide) => {
          console.log("receive", currentSlide, state.maxNext);
          if (state.maxNext !== currentSlide) {
            state.maxNext = currentSlide;
            swiperRef.current.allowSlideNext = true;
            swiperRef.current.slideTo(currentSlide, 1000, true);
          }
          swiperRef.current.allowSlideNext = false;
        });
      }
      socket.on("change-slide", (data) => {
        state.hostSlideIndex = data.current;
        if (data.current > state.maxNext) {
          state.maxNext = data.current;
          state.auto = true;
          swiperRef.current.allowSlideNext = true;
          console.log("got");
          if (state.sync) {
            swiperRef.current.slideTo(data.current, 1000, true);
            swiperRef.current.allowSlideNext = false;
          }
          state.auto = false;
          return;
        }

        if (data.previous === swiperRef.current.activeIndex) {
          console.log("sssss");
          swiperRef.current.allowSlideNext = true;
          swiperRef.current.slideTo(data.current, 1000, true);
        }
      });
    }
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, A11y, Keyboard, Zoom]}
        spaceBetween={50}
        slidesPerView={1}
        zoom={true}
        navigation={onEnter}
        keyboard={{ enabled: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={slideChange}
        onDestroy={() => {
          console.log("destroy");
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (presentation.User !== "HOST") {
            swiper.allowSlideNext = false;
          }
        }}
        className={active ? "enabledBtn " : ""}
      >
        {presentation.imageSlides.map((slide) => {
          return (
            <SwiperSlide key={slide.id}>
              <img
                src={slide.imageLink}
                alt=""
                className="object-contain w-full h-full"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* {presentation.User !== "HOST" && !syncButton && (
        <>
          <button
            onClick={syncSlide}
            title={syncButton ? "" : "Sync"}
            className={`absolute right-44 bottom-14 bg-black p-2 rounded-full z-50 hover:bg-slate-400  ${
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
      )} */}
    </>
  );
}

export default SwiperMySlide;
