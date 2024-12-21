import { RTMClient, RTMEvents } from "agora-rtm-sdk";
import AgoraRTM from "agora-rtm-sdk";
import { create } from "zustand";
import { AGORA_APP_ID, MIC_STATE } from "@/constants/routes";
import { usepresentationStore } from "./presentationStore";
import { Message, useMessageStore } from "./messageStore";
import { useAudioStore } from "./audioStore";
import { toast } from "@/hooks/use-toast";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useModalStore } from "./modalStore";
import safeAwait from "@/util/safeAwait";
import retryWithBackoff from "@/util/retryWithBackoff";
import { useSlideStore } from "./slideStore";

const statusPriority: { [key: string]: number } = {
    REQ_MIC: 1,
    CAN_SPK: 2,
    MIC_MUTED: 3,
    MIC_OFF: 4
};

interface User {
    id: string;
    userName: string;
    micState: MIC_STATE;
};

interface RtmStore {
    userName: string;
    setUserName: (name: string) => void;
    token: {
        rtcUid: string;
        rtmToken: string;
        rtcToken: string;
    } | null;
    setToken: (token: RtmStore["token"]) => void;
    audio: HTMLAudioElement | null;
    status: "DISCONNECTED" | "CONNECTING" | "RECONNECTING" | "CONNECTED" | "FAILED" | "DISCONNECTING";
    rtm: RTMClient | null;
    host: User | null;
    coHostId: string;
    users: { [key: string]: User };
    sortedUsers: User[];
    setSortedUsers: () => void;
    removeUser: (uid: IAgoraRTCRemoteUser["uid"]) => void;
    reconnect: () => Promise<void>;
    init: () => Promise<void>;
    messageListerner: (message: RTMEvents.MessageEvent) => Promise<void>;
    presencesEvent: (data: RTMEvents.PresenceEvent) => void;
    handleUserDataChange: () => (event: RTMEvents.PresenceEvent) => void;
    resetStore: () => void;
};

const endAudio = useAudioStore.getState().endAudio;

export const useRtmStore = create<RtmStore>((set, get) => ({
    userName: "",
    setUserName: function (name) {
        set({ userName: name });
    },
    token: null,
    setToken: function (token) {
        set({ token });
    },
    audio: null,
    status: "CONNECTING",
    rtm: null,
    host: null,
    coHostId: "",
    users: {},
    sortedUsers: [],
    setSortedUsers: function () {
        const users = Object.values(get().users).sort((a, b) => {
            // check if either co-host
            if (a.id === get().coHostId) return -1;
            if (b.id === get().coHostId) return 1;

            // Check if either user is the current user
            if (a.id === get().token?.rtcUid) return -1;
            if (b.id === get().token?.rtcUid) return 1;

            // Compare based on status priority
            return (
                statusPriority[String(a.micState)] - statusPriority[String(b.micState)]
            );
        });
        set({ sortedUsers: users });
    },
    removeUser: function (uid) {
        if (uid === get().host?.id) {
            set({ host: null });
            return;
        }
        const users = { ...get().users };
        if (users[uid]) {
            if (usepresentationStore.getState().presentation?.User === "HOST" && uid === get().coHostId) {
                toast({
                    description: "The co-host have left the presentation"
                });
            }
            delete users[uid];
            set({ users });
        }
    },
    messageListerner: async function (messageData: RTMEvents.MessageEvent) {
        const presentation = usepresentationStore.getState().presentation;
        if (!presentation) return;
        if (messageData.message === "LIVE") {
            if (presentation.User !== "HOST") {
                if (presentation.status === "NOT_LIVE") {
                    usepresentationStore.setState({ presentation: { ...presentation, status: "LIVE" } });
                    useSlideStore.setState({ synced: true });
                    return;
                }

                if (presentation.status === "AUDIO") {
                    await endAudio({ hostEnd: true });
                }

                usepresentationStore.setState({ presentation: { ...presentation, status: "NOT_LIVE" } });
            }
        } else if (messageData.message === "START_AUDIO") {
            if (presentation.User === "GUEST") {
                usepresentationStore.setState((state) => ({ ...state, presentation: { ...state.presentation!, audio: true, live: true } }));
                useModalStore.getState().startPrompt();
            }
        } else if (messageData.message === "END_AUDIO") {
            if (presentation.User !== "HOST") {
                useModalStore.setState({ isOpen: false });
                endAudio({
                    hostEnd: true
                });
            }
        } else if (messageData.message === MIC_STATE.MIC_MUTED || messageData.message === MIC_STATE.MIC_OFF) {
            if (messageData.message === MIC_STATE.MIC_MUTED) {
                const audio = get().audio;
                if (audio) {
                    audio.play().catch((error) => {
                        console.error("Error playing audio", error);
                    });
                    toast({
                        description: "Unmute your mic to speak"
                    });
                }
            }
            else if (messageData.message === MIC_STATE.MIC_OFF) {
                toast({ description: "Your microphone is muted by the host" });
            }
            useAudioStore.getState().setMicState(messageData.message);
        } else if (messageData.message.toString().startsWith("present")) {
            const liveId = messageData.message.toString().split("-")[1];
            const allPresentationData = usepresentationStore.getState().allPresentationData;
            const originalPresentation = usepresentationStore.getState().presentation;

            if (originalPresentation?.liveId === liveId) {
                await safeAwait(usepresentationStore.getState().loadPresentation(originalPresentation.pdfLink, originalPresentation.liveId));
                return;
            }

            const presentationPresent = allPresentationData.find((presentation) => presentation.liveId === liveId);
            if (presentationPresent) {
                await safeAwait(usepresentationStore.getState().loadPresentation(presentationPresent.url, presentationPresent.liveId));
                return;
            }

            const rtm = get().rtm;

            if (rtm) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_, storageData] = await safeAwait(rtm.storage.getChannelMetadata(originalPresentation!.liveId, "MESSAGE"));
                const presentationData = JSON.parse(storageData?.metadata["all-presentations"]?.value || "[]");
                usepresentationStore.setState((state) => {
                    if (!state.presentation) return state;
                    return { ...state, allPresentationData: presentationData };
                });

                const presentationPresent = usepresentationStore.getState().allPresentationData.find((presentation) => presentation.liveId === liveId);
                if (presentationPresent) {
                    await safeAwait(usepresentationStore.getState().loadPresentation(presentationPresent.url, presentationPresent.liveId));
                    return;
                }
            }

            toast({
                description: "Presentation not found",
                title: "Error",
                variant: "destructive"
            });
        } else if (typeof messageData.message === "string") {
            const message = JSON.parse(messageData.message) as Message;
            if (messageData.publisher.includes(get().token!.rtcUid) || messageData.publisher === get().token!.rtcUid) {
                return;
            }

            message.time = new Date().toLocaleTimeString("en-UK", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
            message.sendingStatus = "success";
            const addMessage = useMessageStore.getState().addUnreadMessage;
            addMessage(message);
        }
    },
    reconnect: async function () {
        const rtm = get().rtm;
        const token = get().token?.rtmToken;
        if (!rtm || !token) return;

        await retryWithBackoff(rtm.login({ token }));
    },
    init: async function () {
        const token = get().token;
        if (!token) throw new Error("Token is required");
        const presentation = usepresentationStore.getState().presentation;
        if (!presentation) throw new Error("Presentation is required");

        const rtm = new AgoraRTM.RTM(
            AGORA_APP_ID,
            presentation.User === "HOST"
                ? `HOST${token.rtcUid}`
                : token.rtcUid
        );

        rtm.addEventListener("status", function (data) {
            set({ status: data.state });
        });

        rtm.addEventListener("message", function (message: RTMEvents.MessageEvent) {
            get().messageListerner(message);
        });
        const rtmToken = get().token?.rtmToken;
        if (!rtmToken) throw new Error("RTM Login Failed");
        await retryWithBackoff(rtm.login({
            token: rtmToken,
        }));

        safeAwait(retryWithBackoff(rtm.subscribe(presentation.liveId, {
            withMetadata: true,
            withMessage: true,
            withPresence: true
        })));

        safeAwait(retryWithBackoff(rtm.presence.setState(presentation.liveId, "MESSAGE", {
            "audio": "false"
        })));

        set({ rtm });
    },
    presencesEvent: function (data: RTMEvents.PresenceEvent) {
        const removeUser = get().removeUser;
        if (data.eventType === "REMOTE_LEAVE" || data.eventType === "REMOTE_TIMEOUT") {
            removeUser(data.publisher);
        } else if (data.eventType === "REMOTE_STATE_CHANGED") {
            const u = data.stateChanged;
            if (Object.keys(u).length === 0) return;
            if (u.audio !== "true") {
                removeUser(data.publisher);
                return;
            }
            if (data.publisher.includes("HOST")) {
                const host = {
                    id: u.id,
                    userName: u.userName,
                    micState: u.micState as MIC_STATE
                };
                set({ host });
                return
            };
            if (!u.userName) return;
            const user = {
                id: u.id,
                userName: u.userName,
                micState: u.micState as MIC_STATE
            }
            set((state) => ({
                users: {
                    ...state.users,
                    [u.id]: user
                }
            }));
        }
    },
    handleUserDataChange: function () {
        let presenceEvents: RTMEvents.PresenceEvent[] = [];
        let timeout: NodeJS.Timeout;

        return function (event: RTMEvents.PresenceEvent) {
            presenceEvents.push(event);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                let playAudio = false;
                for (const event of presenceEvents) {
                    if (event.stateChanged.micState === String(MIC_STATE.REQ_MIC)) {
                        playAudio = true;
                    }

                    get().presencesEvent(event);
                }
                if (playAudio) {
                    toast({
                        description: "Someone requested to speak"
                    });
                    get().audio?.play().catch((error) => {
                        console.error("Error playing audio", error);
                    });
                }
                presenceEvents = [];
            }
                , 1000);
        }
    },
    resetStore: function () {
        set({
            userName: "",
            token: null,
            audio: null,
            status: "DISCONNECTED",
            rtm: null,
            host: null,
            coHostId: "",
            users: {},
            sortedUsers: []
        });
    }
}));