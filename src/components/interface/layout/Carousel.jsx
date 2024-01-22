/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect, useContext } from 'react';
import SwiperMySlide from './assets/carousel/Swiper';
import { FaExpand, FaChevronUp, FaSync } from 'react-icons/fa';
import animation1 from './assets/images/animation1.gif';
import animation2 from './assets/images/animation2.gif';
import { ToastContainer } from 'react-toastify';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Button } from '@mui/material';
import { LoadingAssetSmall2 } from '../../../assets/assets';
import { isIOS } from 'react-device-detect';
import { PresentationContext } from '../../../contexts/presentationContext';
import Actions from '../PresentationActions';
import ShareAPI from './Share';

// let stopFunction = false;
// let navBar = false;
let wakeLock = null;
let setTimerActive = null;

export const Carousel = ({ nav }) => {
  const { presentation, makeLive, socket, livePending, syncButton, syncSlide } =
    useContext(PresentationContext);
  const [actionsActive, setActionsActive] = useState(true);
  const [enableFullscreen, setEnableFullScreen] = useState(false);
  const userRef = useRef();
  const [status, setStatus] = useState({
    online: false,
    offline: false,
  });
  const [fullscreen, setFullscreen] = useState(false);
  const [closeChatModal, setCloseChatModal] = useState(false);

  const [specialMedia, setSpecialMedia] = useState({
    toggled: false,
    animation1: false,
    animation2: false,
  });

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
    setFullscreen((prev) => !prev);

    if (!isIOS && document.fullscreenEnabled) {
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement &&
        !document.webkitCurrentFullScreenElement
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
        } else if (element.webkitEnterFullScreen) {
          element.webkitEnterFullScreen();
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
    } else {
      setFullscreen(false);
    }
  }

  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      socket.connect();
    }
    setStatus((prevState) => ({
      ...prevState,
      online: navigator.onLine ? true : 'null',
      offline: !navigator.onLine ? true : 'null',
    }));
  };

  useEffect(() => {
    if (status.online === true) {
      setTimeout(() => {
        setStatus((prevState) => ({
          ...prevState,
          online: false,
        }));
      }, 3000);
    }
  }, [status]);
  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    handleMouseMove();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const requireWakeLock = async () => {
    try {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      //
    }
  };
  const handleScreenOrientation = (e) => {
    if (e.matches) {
      setSpecialMedia((prev) => ({
        ...prev,
        animation1: false,
        animation2: true,
      }));
    } else if (!e.matches && window.innerWidth < 900) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: true,
        animation1: true,
      }));
    }
  };
  // check if window is mobile view
  useEffect(() => {
    if (window.innerWidth < 900) {
      setSpecialMedia((prev) => ({
        ...prev,
        toggled: true,
        animation1: true,
      }));
    }

    handleScreenOrientation(window.matchMedia('(orientation: landscape)'));

    (async function () {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');

          document.addEventListener('visibilitychange', requireWakeLock);
        }
      } catch (err) {
        //
      }
    })();

    window
      .matchMedia('(orientation: landscape)')
      .addEventListener('change', handleScreenOrientation);

    return () => {
      window
        .matchMedia('(orientation: landscape)')
        .removeEventListener('change', handleScreenOrientation);

      if (wakeLock) {
        document.removeEventListener('visibilitychange', requireWakeLock);
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, []);

  useEffect(() => {}, [fullscreen]);

  const handleMouseMove = () => {
    setActionsActive(true);
    if (setTimerActive) {
      clearTimeout(setTimerActive);
    }

    setTimerActive = setTimeout(() => {
      setActionsActive(false);
    }, 5000);
  };

  const handleMouseClick = (e) => {
    if (e.target.tagName !== 'IMG') return;
    if (actionsActive) {
      setActionsActive(false);
      if (setTimerActive) {
        clearTimeout(setTimerActive);
      }
    } else {
      handleMouseMove();
    }
  };

  return (
    <>
      <div
        className={`carousel relative lg:h-[650px] w-[100%] overflow-y-hidden  mx-auto select-none  ${
          enableFullscreen && 'h-full w-full rotate-90'
        }`}
        ref={userRef}
        onMouseMove={handleMouseMove}
        onClick={(e) => handleMouseClick(e)}
      >
        {presentation.User === 'HOST' && actionsActive && (
          <ShareAPI outline={true} />
        )}

        <div
          onClick={() => {
            setCloseChatModal(true);
          }}
          className='carousel__track-container h-full relative'
        >
          <ul className='h-full w-full flex relative '>
            <SwiperMySlide actionsActive={actionsActive} />
          </ul>
        </div>
        <div
          className={`absolute lg:hidden z-20 top-6 right-6  ${
            actionsActive ? 'block' : 'hidden'
          }`}
        >
          {presentation.User === 'HOST' && (
            <Button
              title={presentation.live ? 'End live' : 'Go live'}
              onClick={makeLive}
              className={`w-[140px] h-[40px] !text-slate-200 !rounded-xl space-x-2 ${
                presentation.live ? '!bg-rose-500/50' : ' !bg-green-500/50'
              }`}
            >
              {livePending ? (
                <LoadingAssetSmall2 />
              ) : (
                <>
                  <p>{presentation.live ? 'End live' : 'Go live'}</p>
                  <RadioButtonCheckedIcon
                    className={`!text-3xl !text-slate-200`}
                  />
                </>
              )}
            </Button>
          )}
        </div>

        {
          <Actions
            active={actionsActive}
            toggleFullScreen={toggleFullScreen}
            presentation={presentation}
            syncButton={syncButton}
            syncSlide={syncSlide}
            fullscreen={fullscreen}
            closeChatModal={closeChatModal}
            setCloseChatModal={setCloseChatModal}
          />
        }
        <ToastContainer />
        {status.online === true ? (
          <div
            className={`online text-center absolute bottom-0 transition-all duration-500 z-40  text-white w-full bg-green-500 font-bold px-2  translate-y-4 opacity-0`}
          >
            {' '}
            Back online{' '}
          </div>
        ) : (
          status.offline === true && (
            <div
              className={`offline absolute bottom-0 text-center transition-all duration-500 z-40  text-white w-full bg-[#ff0000] font-bold px-2  translate-y-4 opacity-0`}
            >
              No internet connection
            </div>
          )
        )}
      </div>

      {specialMedia.toggled && (
        <div className='w-full h-screen fixed top-0 left-0 bottom-0 bg-black z-50'>
          {specialMedia.animation1 && (
            <div className='w-full h-full grid place-content-center'>
              <div className='w-fit h-fit flex flex-col justify-between items-center'>
                <img src={animation1} alt='animation image' />

                <p className='text-slate-200 w-[80%] text-center'>
                  Bring down notifications panel and change orientation to
                  Landscape
                </p>
              </div>
            </div>
          )}

          {!specialMedia.animation1 &&
            specialMedia.animation2 &&
            !fullscreen && (
              <div className='w-full h-full grid place-content-center'>
                <div className='w-fit h-fit flex flex-col justify-between items-center'>
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
