import RTC, { ConnectionState, IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { create } from "zustand";
import { useRtmStore } from "./rtmStore";
import { usepresentationStore } from "./presentationStore";
import { toast } from "@/hooks/use-toast";
import { AGORA_APP_ID, MIC_STATE } from "@/constants/routes";
import AgoraRTC from "agora-rtc-sdk-ng";
import { RTMEvents } from "agora-rtm-sdk";
import safeAwait from "@/util/safeAwait";
import { useSlideStore } from "./slideStore";
import { authFetch } from "@/lib/axios";
import retryWithBackoff from "@/util/retryWithBackoff";

interface AudioStore {
    rtcClient: IAgoraRTCClient | null;
    loadingStatus: "success" | "loading" | "error" | "idel";
    networkStatus: "Unknown" | "good" | "mid" | "poor" | "No Connection";
    audioConnectionState: ConnectionState | null;
    micState: MIC_STATE;
    screenShareEnabled: boolean;
    iAmScreenSharing: boolean;
    screenShareMinimized: boolean;
    startScreenShare: () => Promise<void>;
    stopScreenShare: () => Promise<void>;
    setMicState: (micState: MIC_STATE) => Promise<void>;
    audioTracks: {
        screenTrack: ILocalVideoTrack | null;
        screenAudioTrack: ILocalAudioTrack | null;
        localAudioTrack: ILocalAudioTrack | null;
        remoteAudioTracks: { [key: string]: IRemoteAudioTrack | undefined };
    } | null;
    acceptMicRequest(userId: string, micState: MIC_STATE): Promise<void>;
    makeCohost: (value: string) => Promise<void>;
    leaveAudio: () => void;
    endAudio: ({
        hostEnd
    }: { hostEnd: boolean }) => Promise<void>;
    fetchRtcToken: () => Promise<void>;
    startAudio: () => Promise<void>;
    init: () => Promise<void>;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    rtcClient: null,
    loadingStatus: "idel",
    networkStatus: "Unknown",
    audioConnectionState: null,
    audioTracks: null,
    micState: MIC_STATE.MIC_OFF,
    screenShareEnabled: false,
    iAmScreenSharing: false,
    screenShareMinimized: false,
    startScreenShare: async function () {
        const rtcClient = get().rtcClient;

        if (!rtcClient) {
            throw new Error();
        }

        const tracks = await AgoraRTC.createScreenVideoTrack({
            encoderConfig: "720p",
            optimizationMode: "detail"
        }, "auto") as ILocalVideoTrack;

        let screenTrack: ILocalVideoTrack;
        let screenAudioTrack: ILocalAudioTrack | null = null;

        if (Array.isArray(tracks)) {
            screenTrack = tracks[0];
            screenAudioTrack = tracks[1];
        } else {
            screenTrack = tracks;
        }

        screenTrack.on("track-ended", async () => {
            await get().stopScreenShare();
        });

        set((state) => ({
            audioTracks: {
                localAudioTrack: state.audioTracks?.localAudioTrack || null,
                remoteAudioTracks: state.audioTracks?.remoteAudioTracks || {},
                screenTrack,
                screenAudioTrack
            },
            screenShareEnabled: true, iAmScreenSharing: true
        }));

        await rtcClient.publish(screenTrack);
        if (screenAudioTrack) {
            await rtcClient.publish(screenAudioTrack);
        }
    },
    stopScreenShare: async function () {
        const rtcClient = get().rtcClient;
        const screenTrack = get().audioTracks?.screenTrack;
        const screenAudioTrack = get().audioTracks?.screenAudioTrack;

        if (!rtcClient || !screenTrack) {
            throw new Error();
        }

        await rtcClient.unpublish(screenTrack);
        screenTrack.close();

        if (screenAudioTrack) {
            await rtcClient.unpublish(screenAudioTrack);
            screenAudioTrack.close();
        }

        set((state) => ({
            audioTracks: {
                localAudioTrack: state.audioTracks?.localAudioTrack || null,
                remoteAudioTracks: state.audioTracks?.remoteAudioTracks || {},
                screenTrack: null,
                screenAudioTrack: null
            },
            screenShareEnabled: false, iAmScreenSharing: false, screenShareMinimized: false
        }));
    },
    setMicState: async function (micState) { /* Mark: mic state */
        set({ micState });
        const localAudioTrack = get().audioTracks?.localAudioTrack;
        const rtcClient = get().rtcClient;
        if (!localAudioTrack || !rtcClient) {
            return;
        }
        
        if (micState === MIC_STATE.CAN_SPK) {
            get().audioTracks?.localAudioTrack?.setMuted(false);
            const [publishErr] = await safeAwait(rtcClient.publish(localAudioTrack));
            if (publishErr) {
                throw new Error("Failed to create audio track");
            }
        } else {
            get().audioTracks?.localAudioTrack?.setMuted(true);
            const [unpublishErr] = await safeAwait(rtcClient.unpublish(localAudioTrack));
            if (unpublishErr) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: "Failed to create audio track"
                });
                return;
            }
        }
        const presentation = usepresentationStore.getState().presentation;
        const userName = usepresentationStore.getState().userName;
        const tokens = useRtmStore.getState().token;
        const rtm = useRtmStore.getState().rtm;
        if (!presentation || !tokens || !rtm) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Presentation or Token not set"
            });
            return;
        }
        const [presenceErr] = await safeAwait(rtm.presence.setState(presentation.liveId, "MESSAGE", {
            id: tokens?.rtcUid || "",
            userName: presentation.User === "HOST" ? "HOST" : useRtmStore.getState().userName,
            "micState": micState,
            "audio": "true",
        }));
        if (presenceErr) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to change mic state"
            });
            return;
        }

        if (presentation.User === "HOST") {
            useRtmStore.setState({ host: { id: tokens.rtcUid, userName, micState } });
            return;
        }

        const usersTemp = { ...useRtmStore.getState().users };
        usersTemp[tokens.rtcUid] = { id: tokens.rtcUid, userName, micState };
        useRtmStore.setState({ users: usersTemp });
    },
    acceptMicRequest: async function (userId: string, micState: MIC_STATE) {
        const rtm = useRtmStore.getState().rtm;
        if (!rtm) {
            toast({
                title: "Error",
                description: "RTM not set",
                variant: "destructive"
            });
            return;
        }
        const [err] = await safeAwait(rtm.publish(userId, micState, {
            channelType: "USER"
        }));
        if (err) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to accept mic request"
            });
        }
    },
    makeCohost: async function (value) {
        const rtm = useRtmStore.getState().rtm;
        const presentation = usepresentationStore.getState().presentation;

        if (!rtm || !presentation) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Presentation or RTM not set"
            });
            return;
        }

        const [err] = await safeAwait(rtm.storage.setChannelMetadata(presentation.liveId, "MESSAGE", [
            {
                key: "co-host",
                value: value
            }
        ], { addUserId: true }));

        if (err) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to make co-host"
            });
        }
    },
    leaveAudio: function () {
        get().audioTracks?.localAudioTrack?.stop();
        get().audioTracks?.localAudioTrack?.close();
        get().rtcClient?.leave().then(() => {
            set({
                rtcClient: null,
                loadingStatus: "idel",
                audioTracks: null,
                audioConnectionState: null,
                micState: MIC_STATE.MIC_OFF,
                networkStatus: "Unknown"
            });
        });
    },
    endAudio: async function ({ hostEnd }: { hostEnd: boolean }) {
        const rtm = useRtmStore.getState().rtm;
        const presentation = usepresentationStore.getState().presentation;

        if (!rtm || !presentation) {
            return;
        }

        const [stateErr] = await safeAwait(rtm.presence.setState(presentation.liveId, "MESSAGE", {
            "MIC_STATE": MIC_STATE.MIC_OFF,
            "audio": "false"
        }));
        if ((presentation.User === "HOST" || presentation.User === "CO-HOST") && get().iAmScreenSharing) {
            await get().stopScreenShare();
        }
        if (stateErr) {
            toast({
                title: "Error",
                variant: "destructive",
                description: `There was a problem ${presentation.User === "HOST" ? "ending" : "leaving"} the call`,
            });
        }
        if (presentation.User === "HOST") {
            const userUid = useRtmStore.getState().token?.rtcUid;
            const [endAudioErr] = await safeAwait(Promise.all([
                rtm.storage.setChannelMetadata(presentation.liveId, "MESSAGE", [
                    {
                        key: "all-presentations",
                        value: JSON.stringify([])
                    }
                ], { addUserId: true }),
                rtm.publish(presentation.liveId, "END_AUDIO"),
                authFetch.put(
                    `/api/v1/ppt/presentations/make-audio/${presentation.id}`,
                    presentation.course,
                    { params: { endOrStart: "end", userUid } }
                )
            ]));

            if (endAudioErr) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: `There was a problem ${presentation.User === "HOST" ? "ending" : "leaving"} the call`,
                });
            }
            if (endAudioErr) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: `There was a problem ${presentation.User === "HOST" ? "ending" : "leaving"} the call`,
                });
            }
        }
        useRtmStore.setState({ host: null, users: {} });
        get().leaveAudio();


        if (presentation.User === "HOST" || hostEnd) {
            usepresentationStore.setState({ presentation: { ...presentation, status: "LIVE" } });
        }
    },
    fetchRtcToken: async function () {
        const presentation = usepresentationStore.getState().presentation;
        const userUid = useRtmStore.getState().token?.rtcUid;
        if (!presentation) throw new Error();
        const { data } = await authFetch.get<{
            rtcToken: string;
        }>(`/api/v1/ppt/presentations/present/token/${presentation.liveId}`, {
            params: { userUid, courseId: presentation.course?.courseId, contentId: presentation.course?.contentId }
        });
        useRtmStore.setState((state) => ({
            token: {
                rtcToken: data.rtcToken,
                rtcUid: state.token?.rtcUid || "",
                rtmToken: state.token?.rtmToken || ""
            }
        }));
    },
    startAudio: async function () {
        try {
            const presentation = usepresentationStore.getState().presentation;
            const tokens = useRtmStore.getState().token;
            if (presentation.status === "NOT_LIVE") {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: "Presentation is not live",
                });
                return;
            }
            if (tokens?.rtcToken) {
                const [err] = await safeAwait(get().init());
                if (err) {
                    toast({
                        title: "Error",
                        variant: "destructive",
                        description: err.message,
                    });
                    set({ loadingStatus: "error" });
                    get().leaveAudio();
                    return;
                }
            } else {
                if (presentation.User === "GUEST") {
                    const [rtcTokenErr] = await safeAwait(get().fetchRtcToken());
                    if (rtcTokenErr) {
                        toast({
                            title: "Error",
                            variant: "destructive",
                            description: "Failed to fetch audio token",
                        });
                        return;
                    }
                } else {
                    const axiosPromise = authFetch.put<{
                        rtcToken: string;
                    }>(
                        `/api/v1/ppt/presentations/make-audio/${presentation.id}`,
                        presentation.course,
                        { params: { userUid: tokens?.rtcUid, endOrStart: "start" } }
                    );
                    const [err, response] = await safeAwait(axiosPromise);
                    if (err) {
                        toast({
                            title: "Error",
                            variant: "destructive",
                            description: "Failed to start audio",
                        });
                        return;
                    }
                    useRtmStore.setState((state) => ({
                        token: {
                            rtcToken: response.data.rtcToken,
                            rtcUid: state.token?.rtcUid || "",
                            rtmToken: state.token?.rtmToken || ""
                        }
                    }));
                }

                const [err] = await safeAwait(get().init());
                if (err) {
                    toast({
                        title: "Error",
                        variant: "destructive",
                        description: err.message,
                    });
                    set({ loadingStatus: "error" });
                    get().leaveAudio();
                    return;
                }
            }



            if (presentation.User === "HOST" && presentation.status !== "AUDIO") {
                const rtm = useRtmStore.getState().rtm;
                if (!rtm) {
                    toast({
                        title: "Error",
                        variant: "destructive",
                        description: "Audio Started but failed to broadcast to guest",
                    });
                    return;
                }
                const [err] = await safeAwait(rtm.publish(presentation.liveId, "START_AUDIO"));
                if (err) {
                    toast({
                        title: "Error",
                        variant: "destructive",
                        description: "Audio Started but failed to broadcast to guest",
                    });
                    return;
                }
            }
            usepresentationStore.setState((state) => ({ presentation: { ...state.presentation, status: "AUDIO" } }));
        } catch (err) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "An error occurred when start audio, please try again"
            });
        }
    },
    init: async function () {
        // try {
        set({ loadingStatus: "loading" });
        const rtcClient = RTC.createClient({ mode: "rtc", codec: "vp8" });

        rtcClient.on("connection-state-change", function (state) {
            set({ audioConnectionState: state });
        });

        rtcClient.on("user-published", async (user, mediaType) => {
            const [err] = await safeAwait(rtcClient?.subscribe(user, mediaType));

            if (err) {
                throw new Error("Failed to subscribe to user audio");
            }

            if (mediaType === "audio") {
                if (!user.audioTrack) return;
                set((state) => ({
                    audioTracks: {
                        localAudioTrack: state.audioTracks?.localAudioTrack ?? null,
                        remoteAudioTracks: {
                            ...state.audioTracks?.remoteAudioTracks,
                            [user.uid]: user.audioTrack ?? undefined
                        },
                        screenTrack: state.audioTracks?.screenTrack ?? null,
                        screenAudioTrack: state.audioTracks?.screenAudioTrack ?? null
                    }
                }));
                user.audioTrack?.play();
            } else if (mediaType === "video") {
                set({ screenShareEnabled: true, iAmScreenSharing: false });
                user.videoTrack?.play("video-container");
            }
        });

        rtcClient.on("user-unpublished", (user, mediaType) => {
            if (mediaType === "audio") {
                set((state) => ({
                    audioTracks: {
                        localAudioTrack: state.audioTracks?.localAudioTrack ?? null,
                        remoteAudioTracks: {
                            ...state.audioTracks?.remoteAudioTracks,
                            [user.uid]: undefined
                        },
                        screenTrack: state.audioTracks?.screenTrack ?? null,
                        screenAudioTrack: state.audioTracks?.screenAudioTrack ?? null
                    }
                }));
            } else if (mediaType === "video") {
                set({ screenShareEnabled: false, iAmScreenSharing: false });
            }
        });

        rtcClient.on("user-left", (user) => {
            useRtmStore.getState().removeUser(user.uid);
            set((state) => ({
                audioTracks: {
                    localAudioTrack: state.audioTracks?.localAudioTrack ?? null,
                    remoteAudioTracks: {
                        ...state.audioTracks?.remoteAudioTracks,
                        [user.uid]: undefined
                    },
                    screenTrack: state.audioTracks?.screenTrack ?? null,
                    screenAudioTrack: state.audioTracks?.screenAudioTrack ?? null
                }
            }));
        });

        rtcClient.on("network-quality", function (quality) {
            const networkLabels = {
                0: "Unknown",
                1: "good",
                2: "mid",
                3: "poor",
                4: "poor",
                5: "poor",
                6: "No Connection"
            };

            set({ networkStatus: networkLabels[quality.uplinkNetworkQuality] as AudioStore['networkStatus'] })
        });

        const presentation = usepresentationStore.getState().presentation;
        const token = useRtmStore.getState().token;

        if (!presentation || !token) {
            throw new Error("Presentation or Token not set");
            // get().leaveAudio();
        }

        const [joinErr] = await safeAwait(rtcClient.join(AGORA_APP_ID, presentation.liveId, token.rtcToken, token.rtcUid));
        if (joinErr) {
            throw new Error("Failed to join the audio");
        }

        const [localAudioTrackErr, localAudioTrack] = await safeAwait(RTC.createMicrophoneAudioTrack({
            encoderConfig: "speech_low_quality",
            AEC: true,
            ANS: true
        }));
        if (localAudioTrackErr) {
            throw new Error("Failed to create audio track");
        }

        set((state) => ({ audioTracks: { localAudioTrack, remoteAudioTracks: state.audioTracks?.remoteAudioTracks ?? {}, screenTrack: state.audioTracks?.screenTrack ?? null, screenAudioTrack: state.audioTracks?.screenAudioTrack ?? null } }));

        get().setMicState(presentation.User === "HOST" ? MIC_STATE.MIC_MUTED : MIC_STATE.MIC_OFF);

        const rtm = useRtmStore.getState().rtm;
        if (!rtm || !token) {
            throw new Error("RTM or Token not set");
        }
        const userDataChange = useRtmStore.getState().handleUserDataChange();
        const presencesEvent = useRtmStore.getState().presencesEvent;
        rtm.addEventListener("presence", function (data: RTMEvents.PresenceEvent) {
            const User = usepresentationStore.getState().presentation?.User;
            if (data.eventType === "REMOTE_STATE_CHANGED" && User === "HOST" || User === "CO-HOST") {
                userDataChange(data);
                return;
            }

            presencesEvent(data);
        });

        if (presentation.User === "GUEST") {
            safeAwait(retryWithBackoff(rtm.subscribe(token.rtcUid)));
        }

        const currentUser = {
            id: token?.rtcUid || "",
            userName: presentation.User === "HOST" ? "HOST" : useRtmStore.getState().userName,
            micState: get().micState,
            audio: "true"
        };
        await safeAwait(rtm.presence.setState(presentation.liveId, "MESSAGE", currentUser));

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
                if (presentation.User === "CO-HOST" || presentation.User === "GUEST") {
                    tempUsrs[currentUser.id] = currentUser;
                }
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, storageData] = await safeAwait(rtm.storage.getChannelMetadata(presentation.liveId, "MESSAGE"));

        useRtmStore.setState({ coHostId: storageData?.metadata["co-host"]?.value || "" });
        const coHostId = useRtmStore.getState().coHostId;
        if (coHostId === token.rtcUid) {
            const swiperRef = useSlideStore.getState().swiperRef;
            swiperRef.swiper.allowSlideNext = true;
            usepresentationStore.setState((state) => {
                if (!state.presentation) return state;
                return { ...state, presentation: { ...state.presentation, User: "CO-HOST" } };
            });
        }

        if (presentation.User === "HOST" && coHostId !== "") {
            rtm.addEventListener("storage", useSlideStore.getState().slidesEvent);
        }

        const presentationData = JSON.parse(storageData?.metadata["all-presentations"]?.value || "[]");
        usepresentationStore.setState((state) => {
            if (!state.presentation) return state;
            return { ...state, allPresentationData: presentationData };
        });

        for (const presentation of presentationData) {
            if (presentation.presenting) {
                usepresentationStore.getState().loadPresentation(presentation.url, presentation.liveId);
                break;
            }
        }

        const audio = new Audio("https://res.cloudinary.com/dsmydljex/video/upload/v1732362719/assets/mic-request_nnca38_nj9fmv.mp3");
        audio.volume = 1;
        audio.load();

        useRtmStore.setState({ audio });

        set({
            loadingStatus: "success",
            rtcClient
        });
    }
}));
