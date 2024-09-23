/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { RTMClient, RTMEvents } from "agora-rtm-sdk/agora-rtm";
import { presentationData } from "../types";
import { MIC_STATE } from "../../../constants/routes";
import { ConnectionState, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import micRequest from "../assets/mic-request.mp3";
import { toast } from "react-toastify";

let slideData = {
  maxSlides: 0,
  hostSlide: 0,
  prevHostSlide: 0
};

let firstTime = true;

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
  audioConnectionState: ConnectionState | null,
  uid?: string,
  presentation?: presentationData
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [synced, setSynced] = useState(false);
  const syncRef = useRef(false);

  // const playNotification = useNotificationSound();
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(function () {
    if (audioConnectionState === "CONNECTED" && rtm && presentation) {
      rtm.presence.setState(presentation.liveId, "MESSAGE", { reconnect: Date.now().toString() })
        .then(function () {
          toast.info("Connected to the server");
        })
        .catch(function () {
          toast.error("Error reconnecting to the server");
          location.reload();
        });
    }
  }, [audioConnectionState, presentation, rtm]);

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
    if (!presentation?.live) return;
    swiperRef.swiper.allowSlideNext = true;
    swiperRef.swiper.slideTo(slideData.hostSlide, 1000, true);
    setSynced(true);
    syncRef.current = true;
    if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
      swiperRef.swiper.allowSlideNext = false;
    }
  };

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

  const changeMicState = useCallback(async function (userName: string, state: MIC_STATE, rtm: RTMClient) {
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
      slideData.hostSlide = newSlideData.hostSlide || 0;
      slideData.maxSlides = newSlideData.maxSlides || 0;
      slideData.prevHostSlide = newSlideData.prevHostSlide || 0;

      if (firstTime) {
        firstTime = false;
        syncSlide();
      }

      if (
        swiperRef.swiper.activeIndex === newSlideData.prevHostSlide && syncRef.current) {
        swiperRef.swiper.allowSlideNext = true;
        swiperRef.swiper.slideTo(newSlideData.hostSlide, 1000, true);
        if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
          swiperRef.swiper.allowSlideNext = false;
        }
      }
    }
  }

  function presencesEvent(data: RTMEvents.PresenceEvent) {
    if (data.eventType === "REMOTE_LEAVE" || data.eventType === "REMOTE_TIMEOUT") {
      if (data.publisher.startsWith("HOST")) {
        setHost(null);
        return;
      }
      setUsers((prev) => {
        const temp = { ...prev };
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
      rtm.addEventListener("presence", function (data: RTMEvents.PresenceEvent) {
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
    } else if (presentation?.User === "GUEST") {
      if (!presentation.live) {
        return;
      }
      if (swiperRef.swiper.activeIndex != slideData.hostSlide) {
        swiperRef.swiper.allowSlideNext = true;
        setSynced(false);
        syncRef.current = false;
      } else if (swiperRef.swiper.activeIndex == slideData.maxSlides) {
        swiperRef.swiper.allowSlideNext = false;
      }
    }
  }
  useEffect(() => {
    if (swiperRef) {
      swiperRef.addEventListener("swiperslidechange", slideHandler);

      if (presentation?.User === "GUEST" && rtm) {
        rtm.addEventListener("presence", presencesEvent);
        rtm.addEventListener("storage", slidesEvent);
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
    user: userArr,
    host,
    changeMicState,
    acceptMicRequest,
    setUsersInfo,
    removeUsers,
    syncSlide
  };
}
