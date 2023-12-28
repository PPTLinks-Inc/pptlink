/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, A11y, Keyboard, Zoom } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { PresentationContext } from "../../../../../contexts/presentationContext";

const SwiperMySlide = ({active}) => {
  const { presentation, swiperRef, slideChange } = useContext(PresentationContext);
  let onEnter;
  if (window.innerWidth < 900) {
    onEnter = false;
  } else {
    onEnter = true;
  }

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
      {presentation.imageSlides.map((slide, index) => {
        return (
          <SwiperSlide key={index}>
            <img
              src={slide}
              alt=""
              className="object-contain w-full h-full"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default SwiperMySlide;
