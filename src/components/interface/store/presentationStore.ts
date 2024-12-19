import { create } from "zustand";
import { presentationData } from "../types";
import { useRtmStore } from "./rtmStore";
import { toast } from "@/hooks/use-toast";
import { DBSchema, openDB, IDBPDatabase } from "idb";
import { authFetch, standardFetch } from "@/lib/axios";
import { useSlideStore } from "./slideStore";

type loadingType = "loading" | "loading-more" | "loaded" | "error";

function initialPresentationData(): presentationData {
    return {
        id: "",
        name: "",
        User: "GUEST",
        status: "NOT_LIVE",
        liveId: "",
        pptLink: "",
        pdfLink: "",
        downloadable: false,
        presenter: "",
        thumbnail: "",
        rtc: {
            rtcUid: "",
            rtcToken: "",
            rtmToken: ""
        }
    }
}

interface MyDB extends DBSchema {
    pdfs: {
        key: string;
        value: {
            key: string;
            blob: Blob;
            date: Date;
        };
        indexes: {
            date: Date;
        };
    };
}

interface presentationStore {
    currentPresentation: {
        pdfFile: string;
        liveId: string;
        pdfLink: string;
    } | null;
    allPresentationData: { url: string; liveId: string, presenting: boolean }[];
    loadProgress: number;
    loadingStatus: loadingType;
    setLoadingStatus: (value: loadingType) => void;
    loadPresentation: (url: string, liveId: string) => Promise<void>;
    addPresentation: ({ url, liveId }: { url: string; liveId: string }) => Promise<void>;
    removePresentation: (liveId: string) => Promise<void>;
    presentation: presentationData;
    setPresentation: (value: presentationData) => void;
    initPdfDB: () => Promise<IDBPDatabase<MyDB>>;
    userName: string,
    showUsersList: boolean;
    setShowUsersList: (value: boolean) => void;
    showMessage: boolean;
    setShowMessage: (value: boolean) => void;
    showOptions: boolean;
    setShowOptions: (value: boolean) => void;
    makeLive: () => Promise<void>;
    resetStore: () => void;
}

export const usepresentationStore = create<presentationStore>((set, get) => ({
    currentPresentation: null,
    allPresentationData: [],
    loadProgress: 0,
    loadingStatus: "loading",
    setLoadingStatus: function (value) {
        set({ loadingStatus: value });
    },
    loadPresentation: async function (url, liveId) {
        try {
            set({ loadProgress: 0, loadingStatus: get().loadingStatus === "loaded" ? "loading-more" : "loading" });
            const db = await get().initPdfDB();
            const tx = db.transaction("pdfs", "readonly");
            const dateIndex = tx.store.index("date");
            const [file, cursor, keys] = await Promise.all([tx.store.get(liveId), dateIndex.openCursor(null, "next"), tx.store.getAllKeys()]);
            await tx.done;

            const limit = 10;
            if (keys.length > limit && cursor?.primaryKey !== liveId) {
                db.delete("pdfs", cursor!.primaryKey).catch(console.error);
            }

            if (file) {
                const pdfUrl = URL.createObjectURL(file.blob);
                set({ currentPresentation: { pdfFile: pdfUrl, liveId, pdfLink: url } });
                useSlideStore.setState({ lockSlide: false });
            } else {
                const response = await standardFetch.get(url, {
                    responseType: "blob", onDownloadProgress: function (progressEvent) {
                        const total = progressEvent.total || 1; // default to 1 to avoid division by zero
                        const progress = Math.round((progressEvent.loaded * 100) / total);
                        set({ loadProgress: progress });
                    }
                });
                const blob = response.data;
                const pdfUrl = URL.createObjectURL(blob);
                set({ currentPresentation: { pdfFile: pdfUrl, liveId, pdfLink: url } });
                useSlideStore.setState({ lockSlide: false });

                await db.put("pdfs", { blob, date: new Date(), key: liveId });
            }
        } catch (err) {
            console.log(err);
            set({ currentPresentation: null, loadingStatus: "error" });
        }
    },
    addPresentation: async function ({ url, liveId: presentationLiveId }) {
        const prevAllPresentationData = get().allPresentationData;
        if (prevAllPresentationData.length >= 10) {
            toast({
                description: "You can only have 10 presentations at a time",
                title: "Error",
                variant: "destructive"
            });
            return;
        }

        const rtm = useRtmStore.getState().rtm;

        if (rtm) {
            const data = [...prevAllPresentationData, { url, liveId: presentationLiveId, presenting: false }];
            await rtm.storage.setChannelMetadata(get().presentation!.liveId, "MESSAGE", [
                {
                    key: "all-presentations",
                    value: JSON.stringify(data)
                }
            ], { addUserId: true });
            set({ allPresentationData: data });
        }
    },
    removePresentation: async function (liveId) {
        const rtm = useRtmStore.getState().rtm;

        if (rtm) {
            const newPresentationData = get().allPresentationData.filter((data) => data.liveId !== liveId);
            await rtm.storage.setChannelMetadata(get().presentation!.liveId, "MESSAGE", [
                {
                    key: "all-presentations",
                    value: JSON.stringify(newPresentationData)
                }
            ], { addUserId: true });

            const originalPresentation = get().presentation!;

            if (liveId === get().currentPresentation?.liveId) {
                get().loadPresentation(originalPresentation.pdfLink, originalPresentation.liveId);
            }
            set({ allPresentationData: newPresentationData });
        }
    },
    initPdfDB: async function () {
        return openDB<MyDB>("PDFStore", 1, {
            upgrade(db) {
                const pdfsStore = db.createObjectStore("pdfs", { keyPath: "key" });
                pdfsStore.createIndex("date", "date");
            }
        });
    },
    presentation: initialPresentationData(),
    setPresentation: function (value) {
        set({ presentation: value });
    },
    userName: "",
    showUsersList: false,
    setShowUsersList: function (value) {
        set({ showUsersList: value });
    },
    showMessage: false,
    setShowMessage: function (value) {
        set({ showMessage: value });
    },
    showOptions: false,
    setShowOptions: function (value) {
        set({ showOptions: value });
    },
    makeLive: async function () {
        try {
            const presentations = get().presentation;
            const rtm = useRtmStore.getState().rtm;
            if (!presentations) throw new Error("No presentation data");
            await authFetch.put(
                `/api/v1/ppt/presentations/make-live/${presentations.id}`
            );
            await rtm?.publish(presentations.liveId, "LIVE");


            const presentation = get().presentation;
            if (!presentation) return;
            const live = presentation.status === "LIVE" || presentation.status === "AUDIO";

            if (!live) {
                toast({ description: "Presentation is now live" });
            } else {
                toast({ description: "Presentation is no longer live" });
            }
            set({ presentation: { ...presentation, status: !live ? "LIVE" : "NOT_LIVE" } });
        } catch (_) {
            toast({
                description: "An error occurred",
                title: "Error",
                variant: "destructive"
            })
        }
    },
    resetStore: function () {
        set({
            presentation: initialPresentationData(),
            userName: "",
            showUsersList: false,
            showMessage: false,
            showOptions: false
        });
    }
}));