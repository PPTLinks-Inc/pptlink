/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from "lodash.debounce";

import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import img1 from '../layout/assets/victoria-nazaruk-2cpW5zq93yY-unsplash.jpg';
import img2 from '../layout/assets/ranurte-kSdi_gqbGGs-unsplash.jpg';
import img3 from '../layout/assets/karsten-winegeart-Ss0A5IX6-XE-unsplash.jpg';
import img4 from '../layout/assets/musa-ortac-A6uObQ0JjGM-unsplash.jpg';
const test_img1 =
  'https://res.cloudinary.com/drll74ba7/image/upload/v1695738116/ppt/6504761e0cf0deca9eae6481/hel%201/images/slide_1_ply1sz.jpg';
import SwiperMySlide from './assets/carousel/Swiper';

import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaDownload,
  FaFileDownload,
} from 'react-icons/fa';

import { ImDownload } from 'react-icons/im';
import debounce from 'lodash.debounce';
// swiper

export const Carousel = () => {
  const list = [test_img1, img1, img2, img3, img4];
  const [active, setActive] = useState(false);
  const [enableFullscreen, setEnableFullScreen] = useState(false);
  const handle = useFullScreenHandle();
  const userRef = useRef();
  const fullscreenElement = useRef(null);

  const [mobile, setMobile] = useState(false);

  function toggleFullScreen() {
    const element = userRef.current;

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
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
      }
      // setEnableFullScreen(true);
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
      // setEnableFullScreen(false)
    }
    // setEnableFullScreen((prevState) => !prevState);
  }

  const debouncedFunctionLead = debounce(
    () => {
      setActive(true);
    },
    3000,
    { leading: true, trailing: false }
  );

  const debouncedFunctionTrail = debounce(
    () => {
      setActive(false);
    },
    3000,
    { leading: false, trailing: true }
  );

  return (
  
      <div
        className={`carousel relative h-[600px] w-[90%]  mx-auto ${
          enableFullscreen && 'h-full w-full rotate-90'
        }`}
        ref={userRef}
        onMouseMove={() => {
          debouncedFunctionTrail(), debouncedFunctionLead();
        }}
      >
        <div className='carousel__track-container h-full relative'>
          <ul className='h-full w-full flex  '>
            <SwiperMySlide list={list} />
          </ul>
        </div>

        <button
          type='button'
          className={`absolute right-4 z-50 bottom-14 ${
            active ? 'block' : 'hidden'
          }`}
        >
          <FaExpand
            size='30px'
            onClick={toggleFullScreen}
            className='text-slate-600'
          />
        </button>
        <button type='button' className='absolute right-16 bottom-14 z-50 '>
          <FaDownload size='30px' className='text-slate-600' />
        </button>
      </div>
    
  );
};
