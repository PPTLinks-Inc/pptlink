/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RTMClient } from "agora-rtm-sdk/agora-rtm";
import { presentationData } from "../types";

let slideData = {
  maxSlides: 0,
  hostSlide: 0,
  prevHostSlide: 0
};
let firstTime = true;
let freeSlide = false;

export default function useSlide(
  start: boolean,
  rtm: RTMClient | null,
  swiperRef: any,
  presentation?: presentationData
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [synced, setSynced] = useState(false);
  const [hostPresent, setHostPresent] = useState(false);

  function syncSlide() {
    swiperRef.swiper.allowSlideNext = true;
    swiperRef.swiper.slideTo(slideData.hostSlide, 1000, true);
    setSynced(true);
    if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
      swiperRef.swiper.allowSlideNext = false;
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
        rtm.addEventListener("presence", function(data) {
          console.log("Data", data);
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
          }
          else if (data.eventType === "REMOTE_JOIN" && data.publisher.startsWith("HOST")) {
            setHostPresent(true);
            freeSlide = false;
            syncSlide();
            swiperRef.swiper.allowSlideNext = false;
          } else if (data.eventType === "REMOTE_LEAVE" && data.publisher.startsWith("HOST")) {
            setHostPresent(false);
            freeSlide = true;
          }
        });
        rtm.addEventListener("storage", function (event) {
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
        });
        swiperRef.swiper.allowSlideNext = false;
      }

      // if (!socket.hasListeners("change-slide")) {
      //   socket.on("change-slide", receiveSlideChange);
      // }

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
    syncSlide
  };
}
