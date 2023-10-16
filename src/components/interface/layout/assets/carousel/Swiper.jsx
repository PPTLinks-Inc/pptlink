/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, A11y, Keyboard, Zoom } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { useEffect } from "react";

let maxNext = 0;
let hostSlideIndex = 0;
let auto = false;
let sync = true;

function SwiperMySlide({ active, socket, presentation, requestIndex, socketId }) {
  const swiperRef = useRef();

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
    }
    else {
      if (slide.activeIndex === maxNext) {
        swiperRef.current.allowSlideNext = false;
        sync = true;
        return;
      }

      if (slide.activeIndex === hostSlideIndex) {
        sync = true;
      }
      
      if (!auto) {
        sync = false;
        swiperRef.current.allowSlideNext = true;
      }
    }
  };

  useEffect(() => {
    if (socket.connected && presentation.User === "HOST") {
      socket.on("request-slide", (guestSocketId) => {
        socket.emit("send-request-slide", {
          guestSocketId,
          currentSlide: swiperRef.current.activeIndex
        });
      });
    }
    else if (socket.connected && presentation.User !== "HOST") {
      if (requestIndex) {
        socket.emit("request-slide", {
          hostSocketId: presentation.hostSocketId,
          guestSocketId: socketId
        });

        socket.on("receive-request-id", (currentSlide) => {
          maxNext = currentSlide;
          auto = true;
          swiperRef.current.allowSlideNext = true;
          if (sync) {
            swiperRef.current.slideTo(currentSlide, 1000, true);
            swiperRef.current.allowSlideNext = false;
          }
          auto = false;
        });
      }
      socket.on("change-slide", (data) => {
        hostSlideIndex = data.current;
        if (data.current > maxNext) {
          maxNext = data.current;
          auto = true;
          swiperRef.current.allowSlideNext = true;
          if (sync) {
            swiperRef.current.slideTo(data.current, 1000, true);
            swiperRef.current.allowSlideNext = false;
          }
          auto = false;
          return;
        }

        if (data.previous === swiperRef.current.activeIndex) {
          swiperRef.current.allowSlideNext = true;
          swiperRef.current.slideTo(data.current, 1000, true);
        }
      });
    }
  }, []);

  return (
    <Swiper
      modules={[Navigation, A11y, Keyboard, Zoom]}
      spaceBetween={50}
      slidesPerView={1}
      zoom={true}
      navigation={onEnter}
      keyboard={{ enabled: true }}
      scrollbar={{ draggable: true }}
      onSlideChange={slideChange}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        if (presentation.User !== "HOST")
          swiperRef.current.allowSlideNext = false;
        else
          hostSlideIndex = swiper.activeIndex;
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
  );
}

export default SwiperMySlide;
