import { create } from "zustand";
import { usepresentationStore } from "./presentationStore";
import { RTMEvents } from "agora-rtm-sdk";
import { useRtmStore } from "./rtmStore";
import { toast } from "@/hooks/use-toast";
import safeAwait from "@/util/safeAwait";

interface SlideStore {
    debounceTimer: NodeJS.Timeout | null;
    lockSlide: boolean;
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
    init: () => Promise<void>;
    resetStore: () => void;
}

export const useSlideStore = create<SlideStore>((set, get) => ({
    debounceTimer: null,
    lockSlide: false,
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

        if (presentation?.status === "NOT_LIVE") return;
        swiperRef.swiper.allowSlideNext = true;
        swiperRef.swiper.slideTo(slideData.hostSlide, 1000, true);
        set({ synced: true });
        if (swiperRef.swiper.activeIndex >= slideData.maxSlides) {
            swiperRef.swiper.allowSlideNext = false;
        }
    },
    slidesEvent: function (event) {
        const slideData = { ...get().slideData };
        const swiperRef = get().swiperRef;
        if (!swiperRef) return;
        if (event.data.metadata.slideData) {
            const newSlideData = JSON.parse(
                event.data.metadata.slideData.value
            ) as typeof slideData;
            slideData.hostSlide = newSlideData.hostSlide || 0;
            slideData.maxSlides = newSlideData.maxSlides || 0;
            slideData.prevHostSlide = newSlideData.prevHostSlide || 0;

            set({ slideData });
            const synced = get().synced;
            const User = usepresentationStore.getState().presentation?.User;

            if (User === "HOST" || User === "CO-HOST") {
                if (event.data.metadata.slideData.authorUid.startsWith("HOST") && User === "HOST") return;
                else if (!event.data.metadata.slideData.authorUid.startsWith("HOST") && User === "CO-HOST") return;

                if (event.data.metadata.slideData.authorUid.startsWith("HOST") && User === "CO-HOST") {
                    set({ lockSlide: true });
                } else if (!event.data.metadata.slideData.authorUid.startsWith("HOST") && User === "HOST") {
                    set({ lockSlide: true });
                }

                swiperRef.swiper.slideTo(newSlideData.hostSlide, 1000, true);
                return;
            }

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
        const swiperRef = get().swiperRef;

        if (get().lockSlide) {
            swiperRef.swiper.allowSlideNext = false;
            const debounceTimer = get().debounceTimer;
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            const timer = setTimeout(function () {
                swiperRef.swiper.allowSlideNext = true;
                set({ lockSlide: false, debounceTimer: null });
            }, 2000);
            set({ debounceTimer: timer });
            return;
        }

        const presentation = usepresentationStore.getState().presentation;
        const rtm = useRtmStore.getState().rtm;
        let slideData = { ...get().slideData };
        if ((presentation?.User === "HOST" && presentation.status !== "NOT_LIVE") || (presentation.User === "CO-HOST" && presentation.status === "AUDIO")) {
            slideData = {
                maxSlides:
                    swiperRef.swiper.activeIndex >= slideData.maxSlides
                        ? swiperRef.swiper.activeIndex
                        : slideData.maxSlides,
                hostSlide: swiperRef.swiper.activeIndex,
                prevHostSlide: slideData.hostSlide,
            };
            set({ slideData });

            rtm?.storage.updateChannelMetadata(presentation.liveId, "MESSAGE", [
                {
                    key: "slideData",
                    value: JSON.stringify(slideData),
                    revision: -1
                }
            ], {
                addUserId: true,
            });
        } else if (presentation.User === "GUEST" || presentation.User === "CO-HOST") {
            if (presentation.status === "NOT_LIVE") {
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
    init: async function () {
        const swiperRef = get().swiperRef;
        function debounce() {
            let timeout: NodeJS.Timeout;;
            return function () {
                clearTimeout(timeout);

                timeout = setTimeout(function () {
                    const slideHandler = get().slideHandler;
                    slideHandler();
                }, 500);
            }
        }
        if (swiperRef) {
            const func = debounce();
            swiperRef.addEventListener("swiperslidechange", func);

            const presentation = usepresentationStore.getState().presentation;
            const rtm = useRtmStore.getState().rtm;
            if (presentation && rtm) {
                if (presentation.User === "GUEST") {
                    if (presentation.status !== "NOT_LIVE") {
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
                    set({ slideData, lockSlide: false });
                    const [err] = await safeAwait(rtm?.storage.setChannelMetadata(presentation.liveId, "MESSAGE", [
                        {
                            key: "slideData",
                            value: JSON.stringify(slideData)
                        }
                    ], { addUserId: true }));

                    if (err) {
                        toast({
                            title: "Error",
                            description: "Failed to set slide data",
                            variant: "destructive"
                        });
                    }
                }
            }
        }
    },
    resetSlideData: async function () {
        const presentation = usepresentationStore.getState().presentation;
        const rtm = useRtmStore.getState().rtm;
        const slideData = {
            maxSlides: 0,
            hostSlide: 0,
            prevHostSlide: 0
        };
        if (presentation && rtm) {
            if (presentation.User === "HOST" && presentation.status !== "NOT_LIVE") {
                await rtm.storage.updateChannelMetadata(presentation.liveId, "MESSAGE", [
                    {
                        key: "slideData",
                        value: JSON.stringify(slideData),
                        revision: -1
                    }
                ], {
                    addUserId: true,
                });
            } else {
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
        }
    },
    resetStore: function () {
        set({
            debounceTimer: null,
            lockSlide: false,
            slideData: {
                maxSlides: 0,
                hostSlide: 0,
                prevHostSlide: 0
            },
            swiperRef: null,
            synced: false
        });
    }
}));