/* eslint-disable */

import { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SERVER_URL } from "../constants/routes";

export const PresentationContext = createContext();

const socket = io(SERVER_URL);
let fetching = false;
let state = {
  maxNext: 0,
  hostSlideIndex: 0,
  sync: true,
};

const PresentationContextProvider = (props) => {
  const controller = new AbortController();
  const swiperRef = useRef();

  const [presentation, setPresentation] = useState(null);

  const [notFound, setNotFound] = useState(false);

  const [socketConnected, setSocketConnected] = useState(0);
  const params = useParams();
  const [syncButton, setSyncButton] = useState(true);

  const syncSlide = () => {
    swiperRef.current.allowSlideNext = true;
    swiperRef.current.slideTo(state.hostSlideIndex, 1000, true);
  };

  const joinRoom = () => {
    if (socket.connected && presentation) {
      socket.emit("join-presentation", {
        liveId: params.id,
        user: presentation.User,
        hostCurrentSlide: swiperRef.current ? swiperRef.current.activeIndex : 0
      }, (response) => {
        if (presentation.User != "HOST") {
          state = {
            ...state,
            maxNext: response.maxSlide,
            hostSlideIndex: response.currentSlide
          }
          if (!swiperRef.current) return;
          if (state.sync && swiperRef.current.activeIndex !== state.hostSlideIndex) {
            syncSlide();
          }
        }
      });
    }
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

  useEffect(() => {
    joinRoom();
    if (presentation) {
      if (presentation.User !== "HOST") {      
        socket.on("change-slide", receiveSlideChange);
      }
    }

    return () => {
      socket.removeListener("change-slide", receiveSlideChange);
    }
  }, [presentation, socketConnected]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("client-live", (live) => {
      setPresentation((prev) => ({ ...prev, live, view: true }));

      if (live && presentation.view) {
        toast.success("Presentation is now live");
      }
      else if (!live) {
        toast.error("Presentation is not live");
      }
    });
    if (fetching) return;

    fetching = true;
    axios
      .get(`/api/v1/ppt/presentations/present/${params.id}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        fetching = false;
        controller.abort();
        setPresentation(data.presentation);
        setNotFound(false);
      })
      .catch((err) => {
        fetching = false;
        setNotFound(true);
      });
  }, []);

  const slideChange = (slide) => {
    if (presentation.User === "HOST" && presentation.live) {
      socket.emit("change-slide", {
        liveId: presentation.liveId,
        currentSlide: slide.activeIndex
      });
    } else {
      if (!presentation.live && presentation.view) return;
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
  };

  const [livePending, setLivePending] = useState(false);

  const makeLive = () => {
    if (presentation) {
      setLivePending(true);
      axios
        .put(`/api/v1/ppt/presentations/make-live/${presentation.id}`, {
          data: !presentation.live,
        })
        .then(({ data }) => {
          if (socket.connected) {
            socket.emit("client-live", {
              liveId: params.id,
              live: !presentation.live,
            });
          }
          setPresentation((prev) => ({ ...prev, live: !prev.live, view: true }));
          setLivePending(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <PresentationContext.Provider
      value={{
        presentation,
        makeLive,
        livePending,
        notFound,
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
