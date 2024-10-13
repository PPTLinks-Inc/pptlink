import { create } from "zustand";
import { usepresentationStore } from "./presentationStore";
import { RTMEvents } from "agora-rtm-sdk";
import { useRtmStore } from "./rtmStore";
import { toast } from "@/hooks/use-toast";

interface SlideStore {
    slideData: {
        maxSlides: number;
        hostSlide: number;
        prevHostSlide: number;
    };
    setSlideData: (data: SlideStore["slideData"]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    swiperRef: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSwiperRef: (ref: any) => void;
    synced: boolean;
    syncSlide: () => void;
    slidesEvent: (event: RTMEvents.StorageEvent) => void;
    slideHandler: () => void;
    init: () => void;
}

export const useSlideStore = create<SlideStore>((set, get) => ({
    slideData: {
        maxSlides: 0,
        hostSlide: 0,
        prevHostSlide: 0
    },
    setSlideData: function (data) {
        set({ slideData: data });
    },
    swiperRef: null,
    setSwiperRef: function (ref) {
        set({ swiperRef: ref });
    },
    synced: false,
    syncSlide: function () {
        const presentation = usepresentationStore.getState().presentation;
        const swiperRef = get().swiperRef;
        const slideData = get().slideData;

        if (!presentation?.live) return;
        swiperRef.swiper.allowSlideNext = true;
        swiperRef.swiper.slideTo(slideData.hostSlide, 1000, true);
        set({ synced: true });
        if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
            swiperRef.swiper.allowSlideNext = false;
        }
    },
    slidesEvent: function (event) {
        // console.log(event);
        const slideData = { ...get().slideData };
        const swiperRef = get().swiperRef;
        if (event.data.metadata.slideData) {
            const newSlideData = JSON.parse(
                event.data.metadata.slideData.value
            ) as typeof slideData;
            slideData.hostSlide = newSlideData.hostSlide || 0;
            slideData.maxSlides = newSlideData.maxSlides || 0;
            slideData.prevHostSlide = newSlideData.prevHostSlide || 0;

            set({ slideData });
            const synced = get().synced;
            if (synced && swiperRef.swiper.activeIndex === newSlideData.prevHostSlide) {
                swiperRef.swiper.allowSlideNext = true;
                swiperRef.swiper.slideTo(newSlideData.hostSlide, 1000, true);
                if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
                    swiperRef.swiper.allowSlideNext = false;
                }
            } else if (!synced) {
                if (swiperRef.swiper.activeIndex < slideData.maxSlides) {
                    swiperRef.swiper.allowSlideNext = true;
                } else {
                    swiperRef.swiper.allowSlideNext = false;
                }
            }
        }
    },
    slideHandler: function () {
        const presentation = usepresentationStore.getState().presentation;
        const swiperRef = get().swiperRef;
        const rtm = useRtmStore.getState().rtm;
        let slideData = { ...get().slideData };
        if (presentation?.User === "HOST" && presentation?.live) {
            slideData = {
                maxSlides:
                    swiperRef.swiper.activeIndex >= slideData.maxSlides
                        ? swiperRef.swiper.activeIndex
                        : slideData.maxSlides,
                hostSlide: swiperRef.swiper.activeIndex,
                prevHostSlide: slideData.hostSlide
            };
            set({ slideData });
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
                if (swiperRef.swiper.activeIndex < slideData.maxSlides) {
                    swiperRef.swiper.allowSlideNext = true;
                } else {
                    swiperRef.swiper.allowSlideNext = false;
                }
                set({ synced: false });
            } else if (swiperRef.swiper.activeIndex == slideData.maxSlides) {
                swiperRef.swiper.allowSlideNext = false;
            }
        }
    },
    init: function () {
        const swiperRef = get().swiperRef;
        if (swiperRef) {
            const slideHandler = get().slideHandler;
            swiperRef.addEventListener("swiperslidechange", slideHandler);

            const presentation = usepresentationStore.getState().presentation;
            const rtm = useRtmStore.getState().rtm;
            const slidesEvent = get().slidesEvent;
            if (presentation && rtm) {
                if (presentation.User === "GUEST") {
                    rtm.addEventListener("storage", slidesEvent);
                    if (presentation.live) {
                        rtm.storage.getChannelMetadata(presentation.liveId, "MESSAGE").then((data) => {
                            const newSlideData = JSON.parse(
                                data.metadata.slideData.value
                            );
                            set({ slideData: newSlideData, synced: true });
                            get().syncSlide();

                        }).catch(function () {
                            toast({
                                title: "Error",
                                description: "Failed to sync slides",
                                variant: "destructive"
                            });
                        });
                    }
                } else if (presentation.User === "HOST") {
                    let slideData = { ...get().slideData };
                    slideData = {
                        maxSlides:
                            swiperRef.swiper.activeIndex >= slideData.maxSlides
                                ? swiperRef.swiper.activeIndex
                                : slideData.maxSlides,
                        hostSlide: swiperRef.swiper.activeIndex,
                        prevHostSlide: slideData.hostSlide
                    };
                    set({ slideData });
                    rtm?.storage.updateChannelMetadata(presentation.liveId, "MESSAGE", [
                        {
                            key: "slideData",
                            value: JSON.stringify(slideData),
                            revision: -1
                        }
                    ]);
                }
            }
        }
    }
}));