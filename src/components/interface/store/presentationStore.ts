import { create } from "zustand";
import { presentationData } from "../types";
import axios from "axios";
import { useRtmStore } from "./rtmStore";
import { toast } from "@/hooks/use-toast";

interface presentationStore {
    presentation: presentationData | null;
    setPresentation: (value: presentationData) => void;
    userName: string,
    showUsersList: boolean;
    setShowUsersList: (value: boolean) => void;
    showMessage: boolean;
    setShowMessage: (value: boolean) => void;
    showOptions: boolean;
    setShowOptions: (value: boolean) => void;
    makeLive: () => Promise<void>;
}

export const usepresentationStore = create<presentationStore>((set, get) => ({
    presentation: null,
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
            await axios.put(
                `/api/v1/ppt/presentations/make-live/${presentations.id}`
            );
            await rtm?.publish(presentations.liveId, "LIVE");


            const presentation = get().presentation;
            if (!presentation) return;
            const live = presentation.live;

            if (!live) {
                toast({ description: "Presentation is now live" });
            } else {
                toast({ description: "Presentation is no longer live" });
            }
            set({ presentation: { ...presentation, live: !live } });
        } catch (_) {
            toast({
                description: "An error occurred",
                title: "Error",
                variant: "destructive"
            })
        }
    }
}));