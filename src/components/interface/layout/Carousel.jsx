import React, { useState } from "react";
import CarouselItems from "./assets/carousel/CarouselItems";

import img from "../layout/assets/annie-spratt-ixtJA53Z0CU-unsplash.jpg";
import img1 from "../layout/assets/victoria-nazaruk-2cpW5zq93yY-unsplash.jpg";
import img2 from "../layout/assets/ranurte-kSdi_gqbGGs-unsplash.jpg";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Carousel = () => {
  const list = [img, img1, img2];
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = (index)=>{
    if(index < 0){
       index = 0
    }else if(index >= 3){
        index = 0
    }
    setActiveIndex(index)

  }

  return (
    <div className="carousel relative h-[80vh] w-[80%] mx-auto">
      <button
        className="absolute top-1/2 -translate-y-1/2 z-10 -left-12"
        onClick={() => updateIndex(activeIndex - 1)}
      >
        <FaChevronLeft className="w-8 h-8" />
      </button>
      <div className="carousel__track-container h-full relative">
    <div className="h-full w-full">
    <ul
          className="carousel__track h-full w-full flex overflow-hidden "
        >
          {list.map((item, index) => (
            <CarouselItems
              key={index}
              active={activeIndex}
              item={item}
              width={"100%"}
            />
          ))}
        </ul>
    </div>
      </div>
      <button
        className="absolute top-1/2 -translate-y-1/2 -right-12"
        onClick={() => updateIndex(activeIndex + 1)} >
        <FaChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};
