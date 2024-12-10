/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */

import { createContext, useCallback, useState, useEffect } from "react";
import {
  useToggle,
  useOrientation,
  useLocalStorage,
  useMount,
  useUnmount
} from "react-use";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { LoadingAssetBig2 } from "../assets/assets";
import PresentationNotFound from "../components/interface/404";
import {
  PresentationContextI,
  presentationData
} from "../components/interface/types";
import { usepresentationStore } from "@/components/interface/store/presentationStore";
import { useRtmStore } from "@/components/interface/store/rtmStore";
import { useAudioStore } from "@/components/interface/store/audioStore";
import { useSlideStore } from "@/components/interface/store/slideStore";
import { toast } from "@/hooks/use-toast";
import { MIC_STATE } from "@/constants/routes";
import { useModalStore } from "@/components/interface/store/modalStore";
import { useMessageStore } from "@/components/interface/store/messageStore";
import { authFetch } from "@/lib/axios";
import useUser from "@/hooks/useUser";
import { RTMEvents } from "agora-rtm-sdk";

const contextValues = {
  fullScreenShow: false,
  fullScreenToggle: () => {},
  isIphone: false,
  isMobilePhone: false,
  containerRef: null
} as unknown as PresentationContextI;

export const PresentationContext = createContext(contextValues);

function OrientationPrompt({
  setShowPrompt
}: {
  setShowPrompt: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className="bg-black absolute w-screen h-full z-50"
      onClick={() => setShowPrompt(false)}
    >
      <button className="absolute right-5 top-5">
        <IoCloseCircleOutline color="white" size={32} />
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <picture>
          <source
            srcSet="https://res.cloudinary.com/dsmydljex/image/upload/v1732362532/assets/rotate.webp"
            type="image/webp"
          />
          <img
            src="https://res.cloudinary.com/dsmydljex/image/upload/v1732362829/assets/rotate_mjjhxg.gif"
            alt="Rotate Image"
            className="w-fit"
          />
        </picture>
      </div>
    </div>
  );
}

const PresentationContextProvider = (props: { children: any }) => {
  const { userQuery } = useUser();
  const user = userQuery.data;
  const params = useParams();
  const [showPrompt, setShowPrompt] = useState(true);
  const [fullScreenShow, fullScreenToggle] = useToggle(false);
  const orientation = useOrientation();
  const [userUid, setUserUid] = useLocalStorage<string>("userUid");
  const [prevUsername] = useLocalStorage<string>("userName");

  const queryClient = useQueryClient();

  const isMobile = useCallback(function ({ iphone = false }) {
    if (iphone) {
      return /iPhone/i.test(navigator.userAgent);
    }
    return /Android|iPhone/i.test(navigator.userAgent);
  }, []);

  const setToken = useRtmStore((state) => state.setToken);
  const setPresentation = usepresentationStore(
    (state) => state.setPresentation
  );
  const startPrompt = useModalStore((state) => state.startPrompt);
  const initRTM = useRtmStore((state) => state.init);
  const setUserName = useRtmStore((state) => state.setUserName);

  const presentationQuery = useQuery<presentationData>({
    queryKey: ["presentation", params.id],
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: async () => {
      setUserName(prevUsername || user?.username || "");
      const { data } = await authFetch.get<{
        sucess: boolean;
        presentation: presentationData;
      }>(`/api/v1/ppt/presentations/present/${params.id}`, {
        params: { userUid }
      });

      setPresentation(data.presentation);

      await usepresentationStore
        .getState()
        .loadPresentation(data.presentation.pdfLink, data.presentation.liveId);

      setToken({
        rtmToken: data.presentation.rtc.rtmToken,
        rtcUid: data.presentation.rtc.rtcUid,
        rtcToken: data.presentation.rtc.rtcToken || ""
      });
      await initRTM();

      setUserUid(data.presentation.rtc.rtcUid);

      if (data.presentation.audio) {
        startPrompt();
      }
      return data.presentation;
    }
  });

  const swiperRef = useSlideStore((state) => state.swiperRef);

  const rtmConnectionState = useRtmStore((state) => state.status);
  const initSlide = useSlideStore((state) => state.init);

  useEffect(
    function () {
      const presentation = usepresentationStore.getState().presentation;
      const setPresentation = usepresentationStore.getState().setPresentation;
      const rtm = useRtmStore.getState().rtm;
      const token = useRtmStore.getState().token;
      const slidesEvent = useSlideStore.getState().slidesEvent;
      const setMicState = useAudioStore.getState().setMicState;

      function storageHandler(e: RTMEvents.StorageEvent) {
        if (
          e.data.metadata["co-host"] &&
          e.data.metadata["co-host"].value !== useRtmStore.getState().coHostId
        ) {
          useRtmStore.setState({
            coHostId: e.data.metadata["co-host"].value
          });
          useRtmStore.getState().setSortedUsers();

          const tempPresentation = usepresentationStore.getState()
            .presentation as presentationData;
          if (e.data.metadata["co-host"].value === token?.rtcUid) {
            const swiperRef = useSlideStore.getState().swiperRef;
            swiperRef.swiper.allowSlideNext = true;
            toast({
              description: "You are now a co-host of this presentation"
            });
            setPresentation({ ...tempPresentation, User: "CO-HOST" });
            if (useAudioStore.getState().micState === MIC_STATE.REQ_MIC) {
              setMicState(MIC_STATE.MIC_MUTED);
            }
          } else if (tempPresentation.User === "CO-HOST") {
            toast({
              description: "You are no longer a co-host of this presentation"
            });
            if (useAudioStore.getState().iAmScreenSharing) {
              useAudioStore.getState().stopScreenShare();
            }
            useSlideStore.setState({ lockSlide: false });
            setPresentation({ ...tempPresentation, User: "GUEST" });
          }
        }

        slidesEvent(e);
      }

      if (rtmConnectionState === "CONNECTED" && swiperRef !== null) {
        initSlide().then(function () {
          if (!presentation) return;
          if (
            presentation.User === "GUEST" ||
            presentation.User === "CO-HOST"
          ) {
            rtm?.addEventListener("storage", storageHandler);
          }
        });
      }

      return function () {
        rtm?.removeEventListener("storage", storageHandler);
      };
    },
    [rtmConnectionState, swiperRef]
  );

  const presentation = usepresentationStore((state) => state.presentation);
  useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryKey: ["orientation-prompt"],
    enabled: presentation !== null,
    queryFn: function () {
      if (
        (orientation.type.includes("landscape") && presentation !== null) ||
        !("orientation" in screen)
      ) {
        setShowPrompt(false);
      }
      return true;
    }
  });

  const isIphone = isMobile({ iphone: true });
  const isMobilePhone = isMobile({ iphone: false });

  const users = useRtmStore((state) => state.users);
  useEffect(
    function () {
      if (users) {
        useRtmStore.getState().setSortedUsers();
      }
    },
    [users]
  );

  const audioConnectionState = useAudioStore(
    (state) => state.audioConnectionState
  );

  useEffect(
    function () {
      const rtm = useRtmStore.getState().rtm;
      const setSlideData = useSlideStore.getState().setSlideData;
      const syncSlide = useSlideStore.getState().syncSlide;
      const synced = useSlideStore.getState().synced;
      const presentation = usepresentationStore.getState().presentation;

      if (
        rtmConnectionState === "CONNECTED" ||
        audioConnectionState === "CONNECTED"
      ) {
        if (rtmConnectionState === "CONNECTED") {
          if (presentation?.audio) {
            const token = useRtmStore.getState().token;
            const micState = useAudioStore.getState().micState;
            rtm?.presence
              .setState(presentation.liveId, "MESSAGE", {
                id: token?.rtcUid || "",
                userName:
                  presentation.User === "HOST"
                    ? "HOST"
                    : useRtmStore.getState().userName,
                micState: micState,
                audio: "true",
                revision: Date.now().toString()
              })
              .catch(function () {
                toast({
                  title: "Error",
                  description: "Failed to set user state",
                  variant: "destructive"
                });
              });

            rtm?.presence
              .getOnlineUsers(presentation.liveId, "MESSAGE", {
                includedState: true
              })
              .then(function (data) {
                type UserType = {
                  [key: string]: {
                    id: string;
                    userName: string;
                    micState: MIC_STATE;
                  };
                };

                const tempUsrs: UserType = {};
                for (let i = 0; i < data.occupants.length; i++) {
                  const u = data.occupants[i];
                  if (u.userId.includes("HOST")) {
                    const host = {
                      id: u.userId,
                      userName: u.states.userName,
                      micState: u.states.micState as MIC_STATE
                    };
                    useRtmStore.setState({ host });
                    continue;
                  }
                  if (Object.keys(u.states).length === 0) continue;
                  if (u.states.audio !== "true") continue;
                  tempUsrs[u.userId] = {
                    id: u.userId,
                    userName: u.states.userName,
                    micState: u.states.micState as MIC_STATE
                  };
                }

                useRtmStore.setState({ users: tempUsrs });
              })
              .catch(function () {
                toast({
                  title: "Error",
                  description: "Failed to update users",
                  variant: "destructive"
                });
              });

            // handle co-host
            rtm?.storage
              .getChannelMetadata(presentation.liveId, "MESSAGE")
              .then(function (coHost) {
                useRtmStore.setState({
                  coHostId: coHost?.metadata["co-host"]?.value || ""
                });
                const coHostId = useRtmStore.getState().coHostId;
                if (coHostId === token?.rtcUid) {
                  const swiperRef = useSlideStore.getState().swiperRef;
                  swiperRef.swiper.allowSlideNext = true;
                  usepresentationStore.setState((state) => {
                    if (!state.presentation) return state;
                    return {
                      ...state,
                      presentation: { ...state.presentation, User: "CO-HOST" }
                    };
                  });
                } else if (
                  usepresentationStore.getState().presentation?.User ===
                  "CO-HOST"
                ) {
                  if (useAudioStore.getState().iAmScreenSharing) {
                    useAudioStore.getState().stopScreenShare();
                  }
                  usepresentationStore.setState((state) => {
                    if (!state.presentation) return state;
                    return {
                      ...state,
                      presentation: { ...state.presentation, User: "GUEST" }
                    };
                  });
                }
              });
          }

          if (presentation?.User === "GUEST") {
            rtm?.storage
              .getChannelMetadata(presentation.liveId, "MESSAGE")
              .then((data) => {
                const newSlideData = JSON.parse(data.metadata.slideData.value);
                setSlideData(newSlideData);
                if (synced) syncSlide();
              })
              .catch(function () {
                toast({
                  title: "Error",
                  description: "Failed to sync slides",
                  variant: "destructive"
                });
              });
          } else if (presentation?.User === "HOST") {
            let slideData = useSlideStore.getState().slideData;
            const swiperRef = useSlideStore.getState().swiperRef;
            if (!swiperRef) return;
            slideData = {
              maxSlides:
                swiperRef.swiper.activeIndex >= slideData.maxSlides
                  ? swiperRef.swiper.activeIndex
                  : slideData.maxSlides,
              hostSlide: swiperRef.swiper.activeIndex,
              prevHostSlide: slideData.hostSlide
            };
            setSlideData(slideData);
            rtm?.storage.updateChannelMetadata(
              presentation.liveId,
              "MESSAGE",
              [
                {
                  key: "slideData",
                  value: JSON.stringify(slideData)
                }
              ],
              {
                addUserId: true
              }
            );
          }
        }
      }
    },
    [rtmConnectionState, audioConnectionState]
  );

  const beforeUnload = useCallback(function beforeUnload(
    e?: BeforeUnloadEvent
  ) {
    if (
      (usepresentationStore.getState().presentation?.audio ||
        usepresentationStore.getState().presentation?.live) &&
      e
    ) {
      const confirmationMessage = "Are you sure you want to leave?";

      console.log("beforeunload");

      e.preventDefault();
      e.returnValue = confirmationMessage;
    }
  }, []);

  useMount(function () {
    window.addEventListener("beforeunload", beforeUnload);
  });

  useUnmount(function () {
    queryClient.removeQueries({
      exact: true,
      queryKey: ["presentation", params.id]
    });
    queryClient.removeQueries({
      exact: true,
      queryKey: ["set-slide-on-first-load"]
    });
    queryClient.removeQueries({
      exact: true,
      queryKey: ["orientation-prompt"]
    });
    useMessageStore.getState().resetStore();
    useModalStore.getState().resetStore();
    useSlideStore.getState().resetStore();
    if (usepresentationStore.getState().presentation?.audio) {
      useAudioStore.getState().endAudio({ hostEnd: false });
    }
    useRtmStore
      .getState()
      .rtm?.logout()
      .then(function () {
        useRtmStore.getState().resetStore();
      });
    usepresentationStore.getState().resetStore();
    window.removeEventListener("beforeunload", beforeUnload);
  });

  return (
    <PresentationContext.Provider
      value={{
        fullScreenShow,
        isIphone,
        isMobilePhone,
        fullScreenToggle
      }}
    >
      {presentationQuery.isLoading ? (
        <div className="bg-black flex justify-center items-center h-screen w-full">
          <LoadingAssetBig2 />
        </div>
      ) : presentationQuery.isError ? (
        <PresentationNotFound />
      ) : (
        <>
          {isMobilePhone && showPrompt && (
            <OrientationPrompt setShowPrompt={setShowPrompt} />
          )}
          {props.children}
        </>
      )}
    </PresentationContext.Provider>
  );
};

export default PresentationContextProvider;
