/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */

import { createContext, useCallback, useEffect, useState } from "react";
import { useToggle, useOrientation, useLocalStorage } from "react-use";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import rotateImage from "../components/interface/assets/rotate.gif";
import { Spinner, SpinnerIos } from "../components/interface/spinner/Spinner";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";
import { MIC_STATE } from "../constants/routes";
import useAudio from "../components/interface/hooks/useAudio";
import { toast } from "react-toastify";
import useRTM from "../components/interface/hooks/useRTM";
import useSlide from "../components/interface/hooks/useSlide";
import {
  presentationData,
  PresentationContextI,
  rtmTokenI
} from "../components/interface/types";
import useAudioUsers from "../components/interface/hooks/useAudioUsers";

const contextValues = {
  fullScreenShow: false,
  fullScreenToggle: () => {},
  isIphone: false,
  isMobilePhone: false,
  presentation: null,
  makeLive: {},
  setSwiperRef: () => {},
  micState: MIC_STATE.MIC_OFF,
  setMicState: () => {},
  audioSuccess: false,
  startPrompt: false,
  setStartPrompt: () => {},
  audioLoading: false,
  audioError: false,
  setMute: () => {},
  joinAudio: false,
  setJoinAudio: () => {},
  userName: "",
  setUserName: () => {},
  rtcToken: null,
  networkStatus: "unknown",
  startAudio: {},
  fetchRtcToken: {},
  synced: false,
  setSynced: () => {},
  rtmConnectionState: "DISCONNECTED"
} as unknown as PresentationContextI;

export const PresentationContext = createContext(contextValues);

function OrientationPrompt({
  setShowPrompt
}: {
  setShowPrompt: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

const PresentationContextProvider = (props: { children: any }) => {
  const [swiperRef, setSwiperRef] = useState<any>();

  const params = useParams();
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const [joinAudio, setJoinAudio] = useState(false);
  const [startPrompt, setStartPrompt] = useState(false);
  const orientation = useOrientation();
  const [userUid, setUserUid] = useLocalStorage<string>("userUid");
  const [tokens, setTokens] = useState<rtmTokenI>();
  const [rtcToken, setRtcToken] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [micState, setMicState] = useState(MIC_STATE.MIC_OFF);
  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const queryClient = useQueryClient();
  const presentationQuery = useQuery<presentationData>({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      const { data } = await axios.get<{
        sucess: boolean;
        presentation: presentationData;
      }>(`/api/v1/ppt/presentations/present/${params.id}`);
      setTokens({
        rtmToken: data.presentation.rtc.rtmToken,
        rtcUid: data.presentation.rtc.rtcUid
      });
      setRtcToken(data.presentation.rtc.rtcToken ?? null);
      setUserUid(data.presentation.rtc.rtcUid);

      if (data.presentation.User !== "HOST" && data.presentation.audio) {
        setStartPrompt(true);
      }
      return data.presentation;
    }
  });

  useEffect(
    function () {
      if (
        tokens !== null &&
        presentationQuery.data?.audio &&
        presentationQuery.data?.live &&
        presentationQuery.data?.User === "HOST" &&
        rtcToken
      ) {
        setJoinAudio(true);
      } else {
        setJoinAudio(false);
      }

      console.log("effect", tokens, presentationQuery.data?.audio, rtcToken);
    },
    [
      tokens,
      presentationQuery.data?.audio,
      presentationQuery.data?.live,
      presentationQuery.data?.User,
      rtcToken
    ]
  );

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
      (orientation.type.includes("landscape") &&
        start &&
        presentationQuery.data?.live) ||
      !("orientation" in screen)
    ) {
      setShowPrompt(false);
    }
  }, [start, orientation, presentationQuery.data?.live]);

  function endAudio() {
    setJoinAudio(false);
    setRtcToken(null);
  }

  const isAudioReady =
    joinAudio && tokens !== null && presentationQuery.data?.audio && rtcToken
      ? true
      : false;
  
    console.log("isAudioReady", tokens, presentationQuery.data?.audio, rtcToken);

  const audioData = useAudio(
    isAudioReady,
    setJoinAudio,
    rtcToken,
    tokens,
    presentationQuery.data
  );
  const signalling = useRTM(endAudio, setStartPrompt, tokens, presentationQuery.data);
  const slides = useSlide(
    signalling.success && presentationQuery.isSuccess,
    signalling.rtm,
    swiperRef,
    presentationQuery.data
  );

  useAudioUsers(signalling.rtm, audioData.joinedAudio);

  const isIphone = isMobile({ iphone: true });
  const isMobilePhone = isMobile({ iphone: false });


  const makeLive = useMutation({
    mutationFn: async function () {
      if (!presentationQuery.data) throw new Error("No presentation data");
      const { data } = await axios.put<never>(
        `/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`
      );
      await signalling.rtm?.publish(presentationQuery.data?.liveId ||"", "LIVE");
      return data;
    },
    onSuccess: function () {
      if (!presentationQuery.data?.live) {
        toast.success("Presentation is now live");
      } else {
        setJoinAudio(false);
        setRtcToken(null);
        toast.success("Presentation is no longer live");
      }
      queryClient.setQueryData<presentationData>(
        ["presentation", params.id],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              live: !prev.live
            };
          }
        }
      );
    },
    onError: function (err) {
      toast.error(err.message || "An error occurred");
    }
  });

  const startAudio = useMutation({
    mutationKey: ["make-audio"],
    retry: false,
    mutationFn: async function () {
      if (!presentationQuery.data?.live) {
        throw new Error("Presentation is not live");
      }
      if (presentationQuery.data?.User !== "HOST") return undefined;
      if (!presentationQuery.data) throw new Error("No presentation data");
      const { data } = await axios.put<
        | {
            rtcToken: string;
          }
        | undefined
      >(
        `/api/v1/ppt/presentations/make-audio/${presentationQuery.data.id}`,
        {},
        { params: { userUid } }
      );
      await signalling.rtm?.publish(presentationQuery.data?.liveId || "", "AUDIO");
      return data;
    },
    onSuccess: function (data) {
      queryClient.setQueryData<presentationData>(
        ["presentation", params.id],
        (prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            audio: !prev.audio
          };
        }
      );
      if (data) {
        setRtcToken(data.rtcToken);
      } else {
        setJoinAudio(false);
        setRtcToken(null);
      }
    },
    onError: function (err) {
      toast.error(err.message || "An error occurred");
    }
  });

  const fetchRtcToken = useMutation({
    retry: false,
    mutationFn: async function () {
      if (!presentationQuery.data) throw new Error("No presentation data");
      const { data } = await axios.get<{
        rtcToken: string;
      }>(
        `/api/v1/ppt/presentations/present/token/${presentationQuery.data.liveId}`,
        {
          params: { userUid }
        }
      );
      return data;
    },
    onSuccess: function (data) {
      setRtcToken(data.rtcToken);
    }
  });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        fullScreenToggle,
        isIphone,
        isMobilePhone,
        presentation: presentationQuery,
        makeLive,
        setSwiperRef,
        micState,
        setMicState,
        startPrompt,
        setStartPrompt,
        audioSuccess: audioData.success,
        audioLoading: audioData.loading,
        audioError: audioData.error,
        setMute: audioData.setMute,
        joinAudio,
        setJoinAudio,
        userName,
        setUserName,
        rtcToken,
        networkStatus: audioData.networkStatus,
        startAudio,
        fetchRtcToken,
        synced: slides.synced,
        syncSlide: slides.syncSlide,
        rtmConnectionState: signalling.rtmConnectionState
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
          {isMobilePhone && showPrompt && presentationQuery.data?.live && (
            <OrientationPrompt setShowPrompt={setShowPrompt} />
          )}
          {!presentationQuery.data?.live &&
          presentationQuery.data?.User !== "HOST" ? (
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
