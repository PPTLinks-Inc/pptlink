/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { RTMClient, RTMEvents } from "agora-rtm-sdk/agora-rtm";
import { presentationData } from "../types";
import { MIC_STATE } from "../../../constants/routes";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import useNotificationSound from "./useNotificationSound";
import micRequest from "../assets/mic-request.mp3";
import { toast } from "react-toastify";

let slideData = {
  maxSlides: 0,
  hostSlide: 0,
  prevHostSlide: 0
};
let firstTime = true;
let freeSlide = false;

const statusPriority: { [key: string]: number } = {
  REQ_MIC: 1,
  CAN_SPK: 2,
  MIC_MUTED: 3,
  MIC_OFF: 4
};

export default function useSlide(
  start: boolean,
  rtm: RTMClient | null,
  swiperRef: any,
  uid?: string,
  presentation?: presentationData
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [synced, setSynced] = useState(false);
  const [hostPresent, setHostPresent] = useState(false);

  // const playNotification = useNotificationSound();
  const audio = useRef<HTMLAudioElement | null>(null);

  const [host, setHost] = useState<{
    id: string;
    userName: string;
    micState: MIC_STATE
  } | null>(null);
  const [users, setUsers] = useState<{
    [key: string]: { id: string; userName: string; micState: MIC_STATE };
  }>({});
  const userArr = useMemo(() => {
    return Object.values(users).sort((a, b) => {
      // Check if either user is the current user
      if (a.id === uid) return -1;
      if (b.id === uid) return 1;

      // Compare based on status priority
      return (
        statusPriority[String(a.micState)] - statusPriority[String(b.micState)]
      );
    });
  }, [uid, users]);

  function syncSlide() {
    swiperRef.swiper.allowSlideNext = true;
    swiperRef.swiper.slideTo(slideData.hostSlide, 1000, true);
    setSynced(true);
    if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
      swiperRef.swiper.allowSlideNext = false;
    }
  }

  function removeUsers(uid: IAgoraRTCRemoteUser["uid"]) {
    setHost((prev) => {
      if (prev?.id === uid) {
        return null;
      }

      return prev;
    });

    setUsers((prev) => {
      const temp = { ...prev };
      if (temp[uid])
        delete temp[uid];
      return temp;
    });
  }

  const changeMicState = useCallback(async function(userName: string, state: MIC_STATE, rtm: RTMClient) {
    console.log("Changing mic state", userName, state, rtm);
    if (!presentation) throw new Error("Presentation not initialized");
    if (!uid) throw new Error("UID not initialized");
    if (userName === "HOST") {
      setHost((prev) => {
        if (prev) {
          return {
            ...prev,
            micState: state
          };
        }
        return null;
      });
    } else {
      setUsers((prev) => {
        const temp = { ...prev };
        if (temp[uid]) {
          temp[uid].micState = state;
        }
        return temp;
      });
    }

    await rtm.presence.setState(presentation.liveId, "MESSAGE", {
      id: uid,
      userName: userName,
      micState: state
    });
  }, [presentation, rtm, uid]);

  async function acceptMicRequest(userId: string, micState: MIC_STATE) {
    if (rtm) {
      console.log("Accepting mic request", userId, micState);
      await rtm.publish(userId, micState, {
        channelType: "USER"
      });
    }
  };

  function slidesEvent(event: RTMEvents.StorageEvent) {
    if (event.data.metadata.slideData) {
      const newSlideData = JSON.parse(
        event.data.metadata.slideData.value
      ) as typeof slideData;
      console.log(newSlideData);
      slideData.hostSlide = newSlideData.hostSlide;
      slideData.maxSlides = newSlideData.maxSlides;
      slideData.prevHostSlide = newSlideData.prevHostSlide;

      if (
        swiperRef.swiper.activeIndex === newSlideData.prevHostSlide ||
        firstTime
      ) {
        firstTime = false;
        swiperRef.swiper.allowSlideNext = true;
        swiperRef.swiper.slideTo(newSlideData.hostSlide, 1000, true);
        setSynced(true);
        if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
          swiperRef.swiper.allowSlideNext = false;
        }
      }
    }
  }

  function presencesEvent(data: RTMEvents.PresenceEvent) {
    if (data.eventType === "SNAPSHOT" && data.snapshot) {
      let foundHost = false;
      for (const member of data.snapshot) {
        if (member.userId.startsWith("HOST")) {
          foundHost = true;
          break;
        }
      }

      if (!foundHost) {
        setHostPresent(false);
        freeSlide = true;
        swiperRef.swiper.allowSlideNext = true;
      }
    } else if (
      data.eventType === "REMOTE_JOIN" &&
      data.publisher.startsWith("HOST")
    ) {
      setHostPresent(true);
      freeSlide = false;
      syncSlide();
      swiperRef.swiper.allowSlideNext = false;
    } else if (
      data.eventType === "REMOTE_LEAVE" &&
      data.publisher.startsWith("HOST")
    ) {
      setHostPresent(false);
      freeSlide = true;
    } else if (data.eventType === "REMOTE_LEAVE" || data.eventType === "REMOTE_TIMEOUT") {
      console.log("Hello", data);
      if (data.publisher.startsWith("HOST")) {
        setHost(null);
        return;
      }
      setUsers((prev) => {
        const temp = { ...prev };
        console.log("user left", temp[data.publisher]);
        if (temp[data.publisher])
          delete temp[data.publisher];
        return temp;
      });
    } else if (data.eventType === "REMOTE_STATE_CHANGED") {
      const u = data.stateChanged;
      if (Object.keys(u).length === 0) return;
      if (!u.userName) return;
      if (u.userName === "HOST") {
        const host: any = {
          id: u.id,
          userName: u.userName,
          micState: u.micState
        };
        setHost(host);
        return
      };
      if (u.id === "null") {
        setUsers((prev) => {
          const temp = { ...prev };
          delete temp[data.publisher];
          return temp;
        });
        return;
      }
      const user: any = {
        id: u.id,
        userName: u.userName,
        micState: u.micState
      }
      setUsers((prev) => ({
        ...prev,
        [u.id]: user
      }));
    }
  }

  const handleUserDataChange = useCallback(
    function () {
      let presenceEvents: RTMEvents.PresenceEvent[] = [];
      let timeout: any;

      return function (event: RTMEvents.PresenceEvent) {
        presenceEvents.push(event);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          let playAudio = false;
          console.log("Presence events", presenceEvents);
          for (const event of presenceEvents) {
            if (event.stateChanged.micState === String(MIC_STATE.REQ_MIC)) {
              playAudio = true;
            }
              
            presencesEvent(event);
          }
          if (playAudio) {
            toast.info("Someone requested to speak");
            audio.current?.play().catch((error) => {
              console.error("Error playing audio", error);
            });
          }
          presenceEvents = [];
        }
        , 1000);
      }
    }
    , []
  );

  const userDataChange = useCallback(handleUserDataChange(), []);

  async function setUsersInfo({
    id,
    userName,
    liveId,
    User
  }: {
    id: string;
    userName: string;
    liveId: string;
    User: presentationData["User"];
  }) {
    if (!rtm) throw new Error("RTM not initialized");
    if (User === "HOST") {
      rtm.addEventListener("presence", function(data: RTMEvents.PresenceEvent) {
        if (data.eventType === "REMOTE_STATE_CHANGED") {
          userDataChange(data);
          return;
        }

        presencesEvent(data);
      });
    }
    await rtm.presence.setState(liveId, "MESSAGE", {
      id,
      userName: User === "HOST" ? "HOST" : userName,
      micState: User === "HOST" ? MIC_STATE.MIC_MUTED : MIC_STATE.MIC_OFF
    });
    if (User === "GUEST") {
      await rtm.subscribe(id);
    }

    const data = await rtm.presence.getOnlineUsers(liveId, "MESSAGE", {
      includedState: true
    });
    console.log(data);

    const tempUsrs: any = {};
    for (let i = 0; i < data.occupants.length; i++) {
      const u = data.occupants[i];
      if (u.states.userName === "HOST") {
        const host: any = {
          id: u.userId,
          userName: u.states.userName,
          micState: u.states.micState
        };
        setHost(host);
        continue
      };
      if (Object.keys(u.states).length === 0) continue;
      if (u.states.id === "null") continue;
      tempUsrs[u.userId] = {
        id: u.userId,
        userName: u.states.userName,
        micState: u.states.micState
      };
    }

    setUsers(tempUsrs);
    if (User === "HOST") {
      audio.current = new Audio(micRequest);
      audio.current.volume = 1;
      audio.current.load();
    }
  }

  useEffect(
    function () {
      if (!start) {
        setSuccess(false);
        setError(false);
        setIsLoading(false);
        return;
      }

      async function init() {
        try {
          setError(false);
          setSuccess(false);
          setIsLoading(true);
          if (!rtm || !presentation) {
            throw new Error("RTM not initialized");
          }
          if (presentation.User === "HOST") {
            await rtm.storage.setChannelMetadata(
              presentation.liveId,
              "MESSAGE",
              [
                {
                  key: "slideData",
                  value: JSON.stringify({ slideData }),
                  revision: -1
                }
              ]
            );
          }
        } catch (err) {
          setError(true);
          setSuccess(false);
        } finally {
          setIsLoading(false);
        }
      }

      init();
    },
    [start]
  );

  useEffect(() => {
    function slideHandler() {
      if (presentation?.User === "HOST" && presentation?.live) {
        slideData = {
          maxSlides:
            swiperRef.swiper.activeIndex >= slideData.maxSlides
              ? swiperRef.swiper.activeIndex
              : slideData.maxSlides,
          hostSlide: swiperRef.swiper.activeIndex,
          prevHostSlide: slideData.hostSlide
        };
        rtm?.storage.updateChannelMetadata(presentation.liveId, "MESSAGE", [
          {
            key: "slideData",
            value: JSON.stringify(slideData),
            revision: -1
          }
        ]);
      } else {
        if (freeSlide) {
          return;
        }
        if (!slideData.maxSlides) {
          swiperRef.swiper.allowSlideNext = true;
          swiperRef.swiper.slideTo(0, 0, false);
          swiperRef.swiper.allowSlideNext = false;
        }
        if (swiperRef.swiper.activeIndex < slideData.maxSlides) {
          swiperRef.swiper.allowSlideNext = true;
          setSynced(false);
        } else {
          swiperRef.swiper.allowSlideNext = false;
        }
      }
    }
    if (swiperRef) {
      swiperRef.addEventListener("swiperslidechange", slideHandler);

      if (presentation?.User !== "HOST" && rtm) {
        rtm.addEventListener("presence", presencesEvent);
        rtm.addEventListener("storage", slidesEvent);
        swiperRef.swiper.allowSlideNext = false;
      }

      return function () {
        swiperRef.removeEventListener("swiperslidechange", slideHandler);
      };
    }
  }, [swiperRef, presentation]);

  return {
    isLoading,
    error,
    success,
    synced,
    hostPresent,
    user: userArr,
    host,
    changeMicState,
    acceptMicRequest,
    setUsersInfo,
    removeUsers,
    syncSlide
  };
}
