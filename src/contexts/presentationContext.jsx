/* eslint-disable react/prop-types */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useToggle, useOrientation, useLocalStorage } from "react-use";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import rotateImage from "../components/interface/assets/rotate.gif";
import { Spinner, SpinnerIos } from "../components/interface/spinner/Spinner";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";
import io from "socket.io-client";
import { MIC_STATE, SERVER_URL } from "../constants/routes";
import useAudio from "../components/interface/hooks/useAudio";
import { toast } from "react-toastify";
import useSignalling from "../components/interface/hooks/useSignalling";

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
  const { current: socket } = useRef(io(SERVER_URL));
  const [swiperRef, setSwiperRef] = useState(null);
  const [syncButton, setSyncButton] = useState(true);
  const params = useParams();
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const [joinAudio, setJoinAudio] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [startPrompt, setStartPrompt] = useState(false);
  const orientation = useOrientation();
  const [userUid, setUserUid] = useLocalStorage("userUid");
  const [tokens, setTokens] = useState(null);
  const [userName, setUserName] = useState("");
  const [micState, setMicState] = useState(MIC_STATE.MIC_OFF);
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

  const receiveSlideChange = useCallback(
    function (currentSlide) {
      state.hostSlideIndex = currentSlide;
      if (currentSlide > state.maxNext) {
        state.maxNext = currentSlide;
      }

      if (state.sync) {
        swiperRef.swiper.allowSlideNext = true;
        swiperRef.swiper.slideTo(currentSlide, 1000, true);
      }
    },
    [swiperRef]
  );

  const queryClient = useQueryClient();
  const presentationQuery = useQuery({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const res = await axios.get(
        `/api/v1/ppt/presentations/present/${params.id}`
      );
      if (
        res.data.presentation.User === "HOST" &&
        res.data.presentation.audio
      ) {
        await fetchRtcToken.mutateAsync(res.data.presentation.liveId);
        setJoinAudio(true);
      } if (res.data.presentation.User !== "HOST" && res.data.presentation.audio) {
        setStartPrompt(true);
      }
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

    if (
      !socket.hasListeners("client-audio") &&
      presentationQuery.isSuccess &&
      presentationQuery.data?.User !== "HOST"
    ) {
      socket.on("client-audio", (audio) => {
        queryClient.setQueryData(["presentation", params.id], (prev) => ({
          ...prev,
          audio
        }));
        if (audio) {
          setStartPrompt(true);
        }
      });
    }

    if (
      presentationQuery.data?.User === "HOST" &&
      presentationQuery.data?.audio
    ) {
      fetchRtcToken
        .mutateAsync(presentationQuery.data?.liveId)
        .then(function () {
          setJoinAudio(true);
        })
        .catch(function() {
          toast.error("Failed to join audio");
        });
    }
  }, [presentationQuery.isSuccess]);

  useEffect(() => {
    if (socketConnected && presentationQuery.isSuccess) {
      socket.emit(
        "join-presentation",
        {
          liveId: params.id,
          user: presentationQuery.data.User,
          hostCurrentSlide: swiperRef ? swiperRef.swiper.activeIndex : 0
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
        if (
          presentationQuery.data.User === "HOST" &&
          presentationQuery.data.live
        ) {
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
        socket.on("change-slide", receiveSlideChange);
      }
      return true;
    }
  });

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
    mutationFn: function () {
      return axios.put(
        `/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`
      );
    },
    onSuccess: function () {
      queryClient.setQueryData(["presentation", params.id], (prev) => ({
        ...prev,
        live: !prev.live
      }));
    }
  });

  const startAudio = useMutation({
    mutationKey: ["make-audio"],
    retry: false,
    mutationFn: function () {
      return axios.put(
        `/api/v1/ppt/presentations/make-audio/${presentationQuery.data.id}`,
        {},
        { params: { userUid } }
      );
    },
    onSuccess: function ({ data }) {
      setTokens(data);
      setUserUid(data.rtcUid);
      setJoinAudio(!presentationQuery.data.audio);
      queryClient.setQueryData(["presentation", params.id], (prev) => ({
        ...prev,
        audio: !prev.audio
      }));
    }
  });

  const fetchRtcToken = useMutation({
    retry: false,
    mutationFn: function (liveId) {
      return axios.get(
        `/api/v1/ppt/presentations/present/token/${liveId ? liveId : presentationQuery.data.liveId}`,
        {
          params: { userUid }
        }
      );
    },
    onSuccess: function ({ data }) {
      setUserUid(data.rtcUid);
      setTokens(data);
    }
  });

  const isReady = useMemo(
    () => joinAudio && tokens !== null && presentationQuery.data?.audio,
    [joinAudio, tokens, presentationQuery.data?.audio]
  );
  const audioData = useAudio(isReady, presentationQuery, tokens, setJoinAudio);

  const signallingData = useSignalling(isReady, presentationQuery, tokens, setJoinAudio, userName, setMicState, audioData.setMute);

  const audioSuccess = useMemo(() => audioData.success && signallingData.success, [audioData.success, signallingData.success]);
  const audioError = useMemo(() => audioData.error || signallingData.error, [audioData.error, signallingData.error]);
  const audioLoading = useMemo(() => audioData.loading || signallingData.loading, [audioData.loading, signallingData.loading]);

  const setMute = useCallback(function(mic) {
    audioData.setMute(mic);
  }, [audioData]);

  useEffect(function() {
    if (audioSuccess) {
      toast.success("Audio connected");
    }

    if (audioError) {
      toast.error("Failed to connect audio");
    }
  }, [audioSuccess, audioError]);

  const isIphone = isMobile({ iphone: true });
  const isMobilePhone = isMobile({ isphone: false });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        fullScreenToggle,
        isIphone,
        isMobilePhone,
        presentation: presentationQuery,
        makeLive,
        startAudio,
        joinAudio,
        setJoinAudio,
        setSwiperRef,
        syncButton,
        syncSlide,
        startPrompt,
        setStartPrompt,
        fetchRtcToken,
        userName,
        setUserName,
        tokens,
        setMute,
        audioSuccess,
        audioError,
        audioLoading,
        users: signallingData.users,
        usersObj: signallingData.usersObj,
        numberOfUsers: signallingData.numberOfUsers,
        host: signallingData.host,
        changeMicState: signallingData.changeMicState,
        acceptMicRequest: signallingData.acceptMicRequest,
        micState,
        setMicState,
        networkStatus: audioData.networkStatus,
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
          {isMobilePhone &&
            showPrompt &&
            presentationQuery.data.live && (
              <OrientationPrompt setShowPrompt={setShowPrompt} />
            )}
          {!presentationQuery.data.live &&
          presentationQuery.data.User !== "HOST" ? (
            isIphone ? (
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
