/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import CarouselItems from "./assets/carousel/CarouselItems";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useOrientation } from "react-use";
import img from "../layout/assets/annie-spratt-ixtJA53Z0CU-unsplash.jpg";
import img1 from "../layout/assets/victoria-nazaruk-2cpW5zq93yY-unsplash.jpg";
import img2 from "../layout/assets/ranurte-kSdi_gqbGGs-unsplash.jpg";
import img3 from "../layout/assets/karsten-winegeart-Ss0A5IX6-XE-unsplash.jpg";
import img4 from "../layout/assets/musa-ortac-A6uObQ0JjGM-unsplash.jpg";
const test_img1 =
  "https://res.cloudinary.com/drll74ba7/image/upload/v1695738116/ppt/6504761e0cf0deca9eae6481/hel%201/images/slide_1_ply1sz.jpg";

import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaDownload,
  FaFileDownload,
} from "react-icons/fa";

// swiper
import SwiperMySlide from "./assets/carousel/Swiper";


export const Carousel = () => {
  const list = [test_img1, img1, img2, img3, img4];
  const [activeIndex, setActiveIndex] = useState(0);
  const [enableFullscreen, setEnableFullScreen] = useState(false);
  const handle = useFullScreenHandle();
  const userRef = useRef();
  const fullscreenElement = useRef(null);

  const [mobile, setMobile] = useState(false);

  const updateIndex = (index) => {
    if (index < 0) {
      index = 0;
    } else if (index >= list.length) {
      index = 0;
    }
    setActiveIndex(index);
  };
  const handleClick = () => {};
  const onClick = () => {
    if (enableFullscreen) {
      handle.exit();
    } else {
      handle.enter();
    }
    setEnableFullScreen((prevState) => !prevState)    
  }

  return (
    <FullScreen handle={handle}>
    <div className={`carousel relative h-[600px] w-[90%]  mx-auto ${enableFullscreen && 'h-full'}`}ref={userRef}>
      
      <button
        className={`absolute top-1/2 -translate-y-1/2 z-10  ${enableFullscreen? 'left-0' : '-left-12'}`}
        onClick={() => updateIndex(activeIndex - 1)}
      >
        <FaChevronLeft  className={`${enableFullscreen ? 'text-white':'text-black'} w-8 h-8`} />
      </button>
      <div className="carousel__track-container h-full relative">
    <ul className="h-full w-full inline-flex overflow-hidden" >
      {list.map((item,index) => {
      return  <CarouselItems key={index}  item={item} active={activeIndex}/>
      })}
    </ul>

      </div>
      <button
        className={`absolute top-1/2 -translate-y-1/2 ${enableFullscreen? 'right-0' : '-right-12'}`}
        onClick={() => updateIndex(activeIndex + 1)} >
        <FaChevronRight className={`${enableFullscreen ? 'text-white':'text-black'} w-8 h-8`} />
      </button>
      
      <button type="button" className="absolute right-1 z-50 bottom-14">
      <FaExpand size='30px' onClick={onClick} color="#eee" />
      </button>
      <button type="button" className="absolute right-1 bottom-4">
      <FaDownload size='30px'/>
      </button>
 
    </div>

    </FullScreen>
  );
};
