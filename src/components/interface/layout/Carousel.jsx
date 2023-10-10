/* eslint-disable react/prop-types */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import SwiperMySlide from './assets/carousel/Swiper';
import { FaExpand, FaChevronUp } from 'react-icons/fa';
import animation1 from './assets/images/animation1.gif';
import animation2 from './assets/images/animation2.gif';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import CopyAllRounded from '@mui/icons-material/CopyAllOutlined';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Button } from '@mui/material';

let stopFunction = false;
let navBar = false;
let timer = 5000;

export const Carousel = ({ nav }) => {
  const [active, setActive] = useState(false);
  const [enableFullscreen, setEnableFullScreen] = useState(false);
  const userRef = useRef();
  const { navbar, setNavbar, navItems } = nav;
  const [isLive, setIsLive] = useState(true);

  const [specialMedia, setSpecialMedia] = useState({
    toggled: false,
    animation1: false,
    animation2: false,
  });

  const imageUrls = [
    'https://res.cloudinary.com/drll74ba7/image/upload/v1695923280/ppt/6515b6cac871bd812e932f38/Best/images/slide_3_leeqln.jpg',
    'https://res.cloudinary.com/drll74ba7/image/upload/v1695923277/ppt/6515b6cac871bd812e932f38/Best/images/slide_2_avpukc.jpg',
    'https://res.cloudinary.com/drll74ba7/image/upload/v1695923274/ppt/6515b6cac871bd812e932f38/Best/images/slide_1_m2meqk.jpg',
    'https://res.cloudinary.com/drll74ba7/image/upload/v1695923270/ppt/6515b6cac871bd812e932f38/Best/images/slide_0_dwrjkr.jpg',
  ];

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

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement &&
      !document.webkitCurrentFullScreenElement
    ) {
      // None of the elements are in full-screen mode, so enter full-screen
      if (element.webkitEnterFullScreen) {
        element.webkitEnterFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.requestFullscreen) {
        element.requestFullscreen();
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

  const debouncedFunctionLead = debounce(
    () => {
      setActive(true);
      console.log('wait');
    },
    200,
    { leading: true, trailing: false }
  );

  const debouncedFunctionTrail = debounce(() => {
    if (stopFunction) return;

    setActive(false);
  }, timer);

  // check if window is mobile view
  useEffect(() => {
    if (window.innerWidth < 900) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: true,
        animation1: true,
      }));
    }

    screen.orientation.addEventListener('change', (event) => {
      if (event.target.type.includes('landscape') && window.innerWidth < 900) {
        setSpecialMedia((prev) => ({
          ...prev,
          animation1: false,
          animation2: true,
        }));
      } else if (
        event.target.type.includes('portrait') &&
        window.innerWidth < 900
      ) {
        setSpecialMedia((prev) => ({
          ...prev,
          toggled: true,
          animation1: true,
        }));
      }
    });
  }, [screen.orientation.type]);

  return (
    <>
      <div
        className={`carousel relative lg:h-[650px] w-[100%] overflow-y-auto  mx-auto select-none ${
          enableFullscreen && 'h-full w-full rotate-90'
        }`}
        ref={userRef}
        onMouseMove={() => {
          debouncedFunctionLead(), debouncedFunctionTrail();
        }}
        onClick={() => {
          debouncedFunctionLead(), debouncedFunctionTrail();
        }}
      >
        {active && (
          <p
            className='max-w-full bg-[white]/10 backdrop-blur-md text-[white]/50 absolute z-[10] left-4 top-6 lg:hidden py-3 px-2 rounded-md md:max-w-sm flex justify-between '
            onClick={() => {
              navigator.clipboard &&
                navigator.clipboard.writeText(window.location.href);
              toast.success('Link Copied successfully');
            }}
          >
            <span>{window.location.href}</span> <CopyAllRounded />
          </p>
        )}
        <div className='carousel__track-container h-full relative'>
          <ul className='h-full w-full flex  '>
            <SwiperMySlide list={imageUrls} active={active} />
          </ul>
        </div>
        <div
          className={`absolute lg:hidden z-20 top-6 right-6  ${
            active ? 'block' : 'hidden'
          }`}
        >
          <Button
            title={isLive ? 'End live' : 'Go live'}
            onClick={() => setIsLive((prev) => !prev)}
            className={` min-w-32 !text-slate-200 !rounded-xl space-x-2  ${
              isLive ? '!bg-rose-500/20' : ' !bg-green-500/20'
            }  `}
          >
            <p>{isLive ? 'End live' : 'Go live'}</p>
            <RadioButtonCheckedIcon className={`!text-3xl !text-slate-200`} />
          </Button>
        </div>

        <nav
          className={`h-16 w-16 rounded-full bottom-12 right-12  z-30 fixed transition-all duration-500 ${
            navbar ? '' : 'active'
          } ${active ? 'block' : 'hidden'}`}
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
              title='Toggle fullscreen'
              aria-label='Toggle fullscreen'
              type='button'
              className={`absolute -left-14 z-50 rounded-full bg-black p-2 bottom-2
            ${active ? 'block' : 'hidden'}
          `}
            >
              <FaExpand
                size='30px'
                onClick={() => toggleFullScreen()}
                className='text-slate-200'
              />
            </button>

            <button
              onClick={() => {
                stopFunction = !stopFunction;
                setNavbar((prev) => !prev);
                navBar = !navBar;
                console.log(stopFunction);
              }}
              className={`text-slate-200 text-2xl rounded-full border active:scale-75 duration-200 border-white bg-black flex items-center z-20 justify-center w-full h-full active:bg-slate-200 transition-all select-none ${
                navBar ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <FaChevronUp />
            </button>
            {navItems.map(({ icon, link, name }, i) => (
              <li
                key={i}
                className={`absolute w-[80%] rounded-full p-2 h-[80%] bg-black z-10 text-slate-200 border border-white transition-all  duration-500 ${
                  navbar && 'duration-300'
                }`}
                style={{
                  transform: navbar
                    ? `translatey(-${(i + 1.1) * 100 + (i + 1) * 8}%)`
                    : 'translateY(0)',
                  transitionDelay: `${(i + 1) / 10}s`,
                  zIndex: navItems.length - (i + 1),
                }}
              >
                <a
                  href={link}
                  className='w-full relative h-full flex items-center  justify-center flex-row-reverse'
                >
                  <span className=''>{icon}</span>
                  <span
                    className={`text-white absolute right-[calc(100%+1rem)] rounded-md p-2 shadow-md transition-all border-white border ${
                      navBar ? 'opacity-100' : 'opacity-0'
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
      </div>

      {specialMedia.toggled && (
        <div className='w-full h-screen fixed top-0 left-0 bottom-0 bg-black z-50'>
          {specialMedia.animation1 && (
            <div className='w-full h-full grid place-content-center'>
              <div className='w-fit h-fit flex flex-col justify-between'>
                <img src={animation1} alt='animation image' />

                <p className='text-slate-200'>Rotate to landscape mode</p>
              </div>
            </div>
          )}

          {!specialMedia.animation1 && specialMedia.animation2 && (
            <div className='w-full h-full grid place-content-center'>
              <div className='w-fit h-fit flex flex-col justify-between'>
                <FaExpand
                  onClick={removeSpecialMedia}
                  className='absolute text-slate-200 text-[70px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
                />

                <img
                  src={animation2}
                  alt='animation image'
                  className='mt-[3rem] ml-[1.5rem] z-10 pointer-events-none'
                />

                <p className='text-slate-200'>Click to make full screen</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
