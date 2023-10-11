/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { Navigation, Scrollbar, A11y, Keyboard, Zoom } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { useEffect } from "react";

// function SwiperControl({ socket, presentation }) {
//   const swiper = useSwiper();
//   useEffect(() => {
//     if (socket.connected && presentation.User !== "HOST") {
//       socket.on("change-slide", (currentSlide) => {
//         console.log(swiper);
//         console.log(currentSlide);
//         swiper.slideTo(currentSlide, 1500, true);
//       });
//     }
//   }, []);

//   return <></>;
// }

function SwiperMySlide({ list, active, socket, presentation }) {
  const swiperRef = useRef();
  let onEnter;
  if (window.innerWidth < 900) {
    onEnter = false;
  } else {
    onEnter = true;
  }

  const slideChange = (slide) => {
    console.log(presentation.User);
    if (socket.connected && presentation.User === "HOST") {
      socket.emit("change-slide", {
        liveId: presentation.liveId,
        currentSlide: slide.activeIndex,
      });
    }
  };

  useEffect(() => {
    if (socket.connected && presentation.User !== "HOST") {
      socket.on("change-slide", (currentSlide) => {
        console.log(swiperRef.current);
        console.log(currentSlide);
        swiperRef.current.slideTo(currentSlide, 1000, true);
      });
    }
  }, []);

  return (
    <Swiper
      modules={[Navigation, Scrollbar, A11y, Keyboard, Zoom]}
      spaceBetween={50}
      slidesPerView={1}
      zoom={true}
      navigation={onEnter}
      keyboard={{ enabled: true }}
      scrollbar={{ draggable: true }}
      onSlideChange={slideChange}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      className={active ? "enabledBtn " : ""}
    >
      {/* <SwiperControl socket={socket} presentation={presentation} /> */}
      {list.map((slide) => {
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
