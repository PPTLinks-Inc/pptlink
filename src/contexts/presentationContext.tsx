/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext
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
import { userContext } from "./userContext";
import { MIC_STATE } from "../constants/routes";
import useAudio from "../components/interface/hooks/useAudio";
import { toast } from "react-toastify";
import useRTM from "../components/interface/hooks/useRTM";
import useSlide from "../components/interface/hooks/useSlide";
import {
  PresentationContextI,
  presentationData,
  rtmTokenI
} from "../components/interface/types";
import { RTMClient } from "agora-rtm-sdk";

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
    <div className="bg-black absolute w-screen h-full z-50" onClick={() => setShowPrompt(false)}>
      <button
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

  const { user } = useContext(userContext);
  const params = useParams();
  const [start, setStart] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const [startPrompt, setStartPrompt] = useState(false);
  const orientation = useOrientation();
  const [userUid, setUserUid] = useLocalStorage<string>("userUid");
  const [tokens, setTokens] = useState<rtmTokenI>();
  const [userName, setUserName] = useState(user?.username || "");
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
      setUserUid(data.presentation.rtc.rtcUid);

      if (data.presentation.audio) {
        setStartPrompt(true);
      }
      return data.presentation;
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
      (orientation.type.includes("landscape") &&
        start &&
        presentationQuery.data?.live) ||
      !("orientation" in screen)
    ) {
      setShowPrompt(false);
    }
  }, [start, orientation, presentationQuery.data?.live]);


  const endAudio = useMutation({
    mutationFn: async function ({
      User,
      liveId,
      presentationId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hostEnd
    }: {
      User: "HOST" | "GUEST";
      liveId: string;
      presentationId: string;
      hostEnd: boolean;
    }) {
      await signalling.rtm?.presence.setState(liveId, "MESSAGE", {
        id: "null",
        userName: "null",
        micState: "null"
      });
      if (User === "HOST") {
        await signalling.rtm?.publish(liveId, "END_AUDIO");
        await axios.put(
          `/api/v1/ppt/presentations/make-audio/${presentationId}`,
          {},
          { params: { endOrStart: "end" } }
        );
      }
      audioData.endAudio();
    },
    onSuccess: function(_, {hostEnd, User}) {
      if (User === "HOST" || hostEnd) {
        queryClient.setQueryData<presentationData>(
          ["presentation", params.id],
          (prev) => {
            if (!prev) return undefined;
            return {
              ...prev,
              audio: false
            };
          }
        );
      }
    },
    onError: function (err) {
      toast.error(err.message || "An error occurred");
    }
  });


  const audioData = useAudio();
  const signalling = useRTM(
    endAudio,
    setStartPrompt,
    changeMicState,
    tokens,
    presentationQuery.data
  );
  const slides = useSlide(
    signalling.success && presentationQuery.isSuccess,
    signalling.rtm,
    swiperRef,
    tokens?.rtcUid,
    presentationQuery.data
  );

  function changeMicState(state: MIC_STATE, rtm: RTMClient | null) {
    if (!rtm) return;
    const user = queryClient.getQueryData<presentationData>([
      "presentation",
      params.id
    ]);
    if (!user) return;
    slides.changeMicState(user.User === "HOST" ? "HOST" : userName, state, rtm)
    .then(function() {
      if (state === MIC_STATE.MIC_MUTED || state === MIC_STATE.MIC_OFF) {
        audioData.setMute(true);
      }
      
      setMicState(state);
    })
    .catch(function(err: any) {
      console.error(err);
      toast.error("An error occurred");
    });
  }


  const isIphone = isMobile({ iphone: true });
  const isMobilePhone = isMobile({ iphone: false });

  const makeLive = useMutation({
    mutationFn: async function ({
      liveId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      live // this is not use in the main mutation, but it is used to toogle the live state
    }: {
      liveId: string;
      live: boolean;
    }) {
      if (!presentationQuery.data) throw new Error("No presentation data");
      const { data } = await axios.put<never>(
        `/api/v1/ppt/presentations/make-live/${presentationQuery.data.id}`
      );
      await signalling.rtm?.publish(liveId, "LIVE");
      return data;
    },
    onSuccess: function (_, { live, liveId }) {
      if (!live) {
        toast.success("Presentation is now live");
      } else {
        toast.success("Presentation is no longer live");
      }
      queryClient.setQueryData<presentationData>(
        ["presentation", liveId],
        (prev) => {
          if (prev) {
            return {
              ...prev,
              live: !live
            };
          }
        }
      );
    },
    onError: function (err) {
      toast.error(err.message || "An error occurred");
    }
  });

  const fetchRtcToken = useMutation({
    mutationFn: async function ({
      liveId,
      userUid
    }: {
      liveId: string;
      userUid?: string;
    }) {
      if (!presentationQuery.data) throw new Error("No presentation data");
      const { data } = await axios.get<{
        rtcToken: string;
      }>(`/api/v1/ppt/presentations/present/token/${liveId}`, {
        params: { userUid }
      });
      return data;
    }
  });

  const startAudio = useMutation({
    mutationKey: ["make-audio"],
    retry: false,
    mutationFn: async function ({
      liveId,
      live,
      User,
      presentationId,
      tokens
    }: {
      liveId: string;
      live: boolean;
      User: "HOST" | "GUEST";
      presentationId: string;
      tokens: presentationData["rtc"];
    }) {
      if (!live) {
        throw new Error("Presentation is not live");
      }
      if (tokens.rtcToken) {
        await audioData.startAudio(liveId, tokens.rtcToken, tokens.rtcUid, slides.removeUsers);
        await slides.setUsersInfo({
          id: tokens.rtcUid,
          userName: userName,
          liveId,
          User
        });
      } else {
        let tempToken: {
          rtcToken: string;
        };

        if (User === "GUEST") {
          tempToken = await fetchRtcToken.mutateAsync({ liveId, userUid });
        } else {
          const { data } = await axios.put<{
            rtcToken: string;
          }>(
            `/api/v1/ppt/presentations/make-audio/${presentationId}`,
            {},
            { params: { userUid, endOrStart: "start" } }
          );
          tempToken = data;
        }

        await audioData.startAudio(liveId, tempToken.rtcToken, tokens.rtcUid, slides.removeUsers);
        await slides.setUsersInfo({
          id: tokens.rtcUid,
          userName: userName,
          liveId,
          User
        });
        return { tokens: tempToken.rtcToken };
      }
    },
    onSuccess: async function (data, { liveId }) {
      try {
        const d = queryClient.getQueryData<presentationData>([
          "presentation", params.id
        ]);
        if (presentationQuery.data?.User === "HOST" && !d?.audio) {
          await signalling.rtm?.publish(liveId, "START_AUDIO");
        }
      } catch (err) {
        // do nothing
      }
      queryClient.setQueryData<presentationData>(
        ["presentation", params.id],
        (prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            audio: true,
            rtc: {
              ...prev.rtc,
              rtcToken: data?.tokens || prev.rtc.rtcToken
            }
          };
        }
      );
    },
    onError: function (err) {
      toast.error(err.message || "An error occurred");
    }
  });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        isIphone,
        isMobilePhone,
        presentation: presentationQuery,
        makeLive,
        micState,
        startPrompt,
        userName,
        networkStatus: audioData.networkStatus,
        startAudio,
        endAudio,
        synced: slides.synced,
        rtmConnectionState: signalling.rtmConnectionState,
        users: slides.user,
        host: slides.host,
        audioData,
        rtm: signalling.rtm,
        changeMicState,
        acceptMicRequest: slides.acceptMicRequest,
        fullScreenToggle,
        setSwiperRef,
        setMicState,
        setStartPrompt,
        setMute: audioData.setMute,
        setUserName,
        syncSlide: slides.syncSlide
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
