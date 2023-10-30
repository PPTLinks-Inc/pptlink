/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, A11y, Keyboard, Zoom } from "swiper/modules";

import "swiper/swiper-bundle.css";

const state = {
  maxNext: 0,
  hostSlideIndex: 0,
  auto: false,
  sync: true,
};

const SwiperMySlide = forwardRef(function SwiperMySlide(
  { active, socket, presentation, requestIndex, socketId, setSyncButton },
  ref
) {
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
      if (slide.activeIndex === state.hostSlideIndex) {
        state.sync = true;
        setSyncButton(true);
      } else {
        state.sync = false;
        setSyncButton(false);
      }
      if (slide.activeIndex === state.maxNext) {
        swiperRef.current.allowSlideNext = false;
        return;
      }

      if (!state.auto) {
        swiperRef.current.allowSlideNext = true;
      }
    }
  };

  const syncSlide = () => {
    swiperRef.current.slideTo(state.hostSlideIndex, 1000, true);
  };

  useImperativeHandle(ref, () => ({
    syncSlide,
  }));

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
          if (state.sync) {
            swiperRef.current.slideTo(data.current, 1000, true);
            swiperRef.current.allowSlideNext = false;
          }
          state.auto = false;
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
  );
});

export default SwiperMySlide;
