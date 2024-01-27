/* eslint-disable react/prop-types */

import { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SERVER_URL } from "../constants/routes";

export const PresentationContext = createContext();

const socket = io(SERVER_URL);
let state = {
  maxNext: 0,
  hostSlideIndex: 0,
  sync: true
};

const PresentationContextProvider = (props) => {
  const swiperRef = useRef();

  const [socketConnected, setSocketConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const params = useParams();
  const [syncButton, setSyncButton] = useState(true);

  const presentationQuery = useQuery({
    queryKey: ["presentation", params.id],
    queryFn: async () => {
      const userUid = localStorage.getItem("userUid");
      const res = await axios.get(`/api/v1/ppt/presentations/present/${params.id}?userUid=${userUid}`);
      setIsLive(res.data.presentation.live);

      if (!userUid) {
        localStorage.setItem("userUid", res.data.presentation.rtcUid);
      }
      return res.data.presentation;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  const syncSlide = () => {
    swiperRef.current.allowSlideNext = true;
    swiperRef.current.slideTo(state.hostSlideIndex, 1000, true);
  };
  
  const receiveSlideChange = (currentSlide) => {
    state.hostSlideIndex = currentSlide;
    if (currentSlide > state.maxNext) {
      state.maxNext = currentSlide;
    }

    if (state.sync) {
      swiperRef.current.allowSlideNext = true;
      swiperRef.current.slideTo(currentSlide, 1000, true);
    }
  };

  const joinRoom = () => {
    if (socket.connected && presentationQuery.isSuccess) {
      socket.emit(
        "join-presentation",
        {
          liveId: params.id,
          presentationId: presentationQuery.data.id,
          user: presentationQuery.data.User,
          hostCurrentSlide: swiperRef.current
            ? swiperRef.current.activeIndex
            : 0
        },
        (response) => {
          if (presentationQuery.data.User != "HOST") {
            if (!socket.hasListeners("change-slide")) {
              socket.on("change-slide", receiveSlideChange);
            }
            state = {
              ...state,
              maxNext: response.maxSlide,
              hostSlideIndex: response.currentSlide
            };
            if (!swiperRef.current) return;
            if (
              presentationQuery.data.live &&
              state.sync &&
              swiperRef.current.activeIndex !== state.hostSlideIndex
            ) {
              syncSlide();
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    if (socketConnected && presentationQuery.isSuccess && isLive) {
      joinRoom();
    }
  }, [socketConnected, isLive]);

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

    if (!socket.hasListeners("client-live")) {
      socket.on("client-live", (live) => {
        setIsLive(live);
        presentationQuery.refetch({throwOnError: false})
        // setPresentation((prev) => ({ ...prev, live }));
      });
    }


    return () => {
      socket.removeListener("change-slide", receiveSlideChange);
    };
  }, []);

  const slideChange = (slide) => {
    if (presentationQuery.data.User === "HOST" && presentationQuery.data.live) {
      socket.emit("change-slide", {
        liveId: presentationQuery.data.liveId,
        currentSlide: slide.activeIndex
      });
    } else {
      if (presentationQuery.data.live) {
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

        if (!state.sync) {
          swiperRef.current.allowSlideNext = true;
        }
      }
    }
  };

  const [livePending, setLivePending] = useState(false);

  const makeLive = () => {
      setLivePending(true);
      axios
        .put(`/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`, {
          data: !presentationQuery.data.live
        })
        .then(() => {
          if (socket.connected) {
            socket.emit("client-live", {
              liveId: params.id,
              live: !presentationQuery.data.live
            });
          }
          presentationQuery.refetch({throwOnError: false});
          setLivePending(false);
        })
        .catch((err) => {
          setLivePending(false);
          toast.error(err.response.data.message);
        });
  };

  return (
    <PresentationContext.Provider
      value={{
        presentationQuery,
        presentation: presentationQuery.data,
        isLive,
        makeLive,
        livePending,
        socket,
        syncButton,
        setSyncButton,
        swiperRef,
        syncSlide,
        state,
        slideChange
      }}
    >
      {props.children}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
