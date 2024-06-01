/* eslint-disable react/prop-types */

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { useToggle, useOrientation } from "react-use";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import rotateImage from "../components/interface/assets/rotate.gif";
import { Spinner, SpinnerIos } from "../components/interface/spinner/Spinner";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";
import io from "socket.io-client";
import { SERVER_URL } from "../constants/routes";

const socket = io(SERVER_URL);

let state = {
  maxNext: 0,
  hostSlideIndex: 0,
  sync: true
};

export const PresentationContext = createContext();

function OrientationPrompt({ setShowPrompt }) {
  return (
    <div className="bg-black absolute w-screen h-full z-50">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute right-5 top-5"
      >
        <IoCloseCircleOutline color="white" size={32} />
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <img src={rotateImage} alt="Rotate Image" className="w-fit" />
      </div>
    </div>
  );
}

const PresentationContextProvider = (props) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [syncButton, setSyncButton] = useState(true);
  const params = useParams();
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const [joinAudio, setJoinAudio] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const orientation = useOrientation();
  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  function syncSlide() {
    swiperRef.swiper.allowSlideNext = true;
    swiperRef.swiper.slideTo(state.hostSlideIndex, 1000, true);
  }

  const receiveSlideChange = useCallback(function(currentSlide) {
    console.log(currentSlide);
    state.hostSlideIndex = currentSlide;
    if (currentSlide > state.maxNext) {
      state.maxNext = currentSlide;
    }

    if (state.sync) {
      console.log(swiperRef);
      swiperRef.swiper.allowSlideNext = true;
      swiperRef.swiper.slideTo(currentSlide, 1000, true);
    }
  }, [swiperRef]);

  const queryClient = useQueryClient();
  const presentationQuery = useQuery({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      // const userUid = localStorage.getItem("userUid");
      const res = await axios.get(
        `/api/v1/ppt/presentations/present/${params.id}`
      );

      // if (!userUid) {
      //   localStorage.setItem("userUid", res.data.presentation.rtcUid);
      // }
      return res.data.presentation;
    }
  });

  useEffect(() => {
    if (!socket.hasListeners("connect")) {
      socket.on("connect", () => {
        setSocketConnected(true);
      });
    }

    if (!socket.hasListeners("disconnect")) {
      socket.on("disconnect", () => {
        setSocketConnected(false);
      });
    }

    if (
      !socket.hasListeners("client-live") &&
      presentationQuery.isSuccess &&
      presentationQuery.data?.User !== "HOST"
    ) {
      socket.on("client-live", (live) => {
        queryClient.setQueryData(["presentation", params.id], (prev) => ({
          ...prev,
          live
        }));
      });
    }
  }, [presentationQuery.isSuccess]);

  // console.log(socketConnected, presentationQuery.isSuccess, swiperRef.current);
  useEffect(() => {
    // console.log(socketConnected, presentationQuery.isSuccess, swiperRef.current)
    if (socketConnected && presentationQuery.isSuccess) {
      socket.emit(
        "join-presentation",
        {
          liveId: params.id,
          user: presentationQuery.data.User,
          hostCurrentSlide: swiperRef
            ? swiperRef.swiper.activeIndex
            : 0
        },
        (response) => {
          if (presentationQuery.data.User != "HOST") {
            state = {
              ...state,
              maxNext: response.maxSlide,
              hostSlideIndex: response.currentSlide
            };
          }
        }
      );
    }
  }, [socketConnected, presentationQuery.isSuccess]);

  useQuery({
    queryKey: ["swiper"],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: swiperRef !== null,
    queryFn: function () {
      swiperRef.addEventListener("swiperslidechange", function () {
        if (presentationQuery.data.User === "HOST" && presentationQuery.data.live) {
          socket.emit("change-slide", {
            liveId: presentationQuery.data.liveId,
            currentSlide: swiperRef.swiper.activeIndex
          });
        } else {
          if (presentationQuery.data.live) {
            if (swiperRef.swiper.activeIndex > state.maxNext) {
              swiperRef.swiper.allowSlideNext = true;
              swiperRef.swiper.slideTo(state.maxNext, 0, false);
              swiperRef.swiper.allowSlideNext = false;
              return;
            }
            if (swiperRef.swiper.activeIndex === state.hostSlideIndex) {
              state.sync = true;
              setSyncButton(true);
            } else {
              setSyncButton(false);
              state.sync = false;
            }
            if (swiperRef.swiper.activeIndex === state.maxNext) {
              swiperRef.swiper.allowSlideNext = false;
              return;
            }
    
            if (!state.sync) {
              swiperRef.swiper.allowSlideNext = true;
            }
          }
        }
      });

      if (
        presentationQuery.data.live &&
        state.sync &&
        swiperRef?.swiper.activeIndex !== state.hostSlideIndex
      ) {
        syncSlide();
      }

      if (!socket.hasListeners("change-slide")) {
        console.log("swiper", swiperRef);
        socket.on("change-slide", receiveSlideChange);
      }
      return true
    }
  })

  useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryKey: ["orientation"],
    queryFn: function () {
      setStart(true);
      return true;
    }
  });

  useEffect(() => {
    if (
      orientation.type.includes("landscape") &&
      start &&
      presentationQuery.data?.live
    ) {
      setShowPrompt(false);
    }
  }, [start, orientation, presentationQuery.data?.live]);

  const makeLive = useMutation({
    mutationFn: async function () {
      await axios.put(
        `/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`,
        {
          data: !presentationQuery.data.live
        }
      );
    },
    onSuccess: function () {
      queryClient.setQueryData(["presentation", params.id], (prev) => ({
        ...prev,
        live: !prev.live
      }));
    }
  });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        fullScreenToggle,
        isMobile,
        presentation: presentationQuery,
        makeLive,
        joinAudio,
        setSwiperRef,
        syncButton,
        syncSlide
      }}
    >
      {presentationQuery.isLoading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <LoadingAssetBig2 />
        </div>
      ) : presentationQuery.isError ? (
        <PresentationNotFound />
      ) : (
        <>
          {isMobile({ isphone: false }) &&
            showPrompt &&
            presentationQuery.data.live && (
              <OrientationPrompt setShowPrompt={setShowPrompt} />
            )}
          {!presentationQuery.data.live &&
          presentationQuery.data.User !== "HOST" ? (
            isMobile({ isphone: true }) ? (
              <SpinnerIos />
            ) : (
              <Spinner />
            )
          ) : (
            <>{props.children}</>
          )}
        </>
      )}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
