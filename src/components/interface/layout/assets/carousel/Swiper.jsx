/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, A11y, Keyboard, Zoom } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { useEffect } from "react";

let maxNext = 0;
let myCurrent = 0;

function SwiperMySlide({ active, socket, presentation }) {
  const swiperRef = useRef();
  const [goNext, setGoNext] = useState(false);
  const [sync, setSync] = useState(true);
  const [hostBack, setHostBack] = useState(false);

  let onEnter;
  if (window.innerWidth < 900) {
    onEnter = false;
  } else {
    onEnter = true;
  }

  const slideChange = (slide) => {
    console.log(slide);
    if (socket.connected && presentation.User === "HOST") {
      socket.emit("change-slide", {
        liveId: presentation.liveId,
        currentSlide: slide.activeIndex,
        previousSlide: slide.previousIndex,
      });
    } else {
      myCurrent = slide.activeIndex;
      if (slide.activeIndex < maxNext) {
        if (!hostBack) {
          setSync(false);
          setGoNext(true);
          return;
        }
        setHostBack(false);
      }
      if (slide.activeIndex === maxNext) {
        setGoNext(false);
        setSync(true);
      }
    }
  };

  useEffect(() => {
    if (presentation.User !== "HOST") {
      if (sync) {
        swiperRef.current.slideTo(myCurrent, 1000, true);
        setGoNext(false);
      }
    }
  }, [goNext]);

  useEffect(() => {
    if (presentation.User === "HOST") {
      setGoNext(true);
    } else {
      if (socket.connected) {
        socket.on("change-slide", (data) => {
          if (data.current > maxNext) {
            console.log(data.current, maxNext);
            maxNext = data.current;
            setHostBack(false);
          }
          else if (sync) {
            setHostBack(true);
            setGoNext(true);
          }
          if (sync) {
            myCurrent = data.current;
            console.log("next", maxNext);
            setGoNext(true);
          }
        });
      }
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
      allowSlideNext={goNext}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      className={active ? "enabledBtn " : ""}
    >
      {/* <SwiperControl socket={socket} presentation={presentation} /> */}
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
