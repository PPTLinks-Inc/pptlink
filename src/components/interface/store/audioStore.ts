import RTC, { ConnectionState, IAgoraRTCClient, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { create } from "zustand";
import { useRtmStore } from "./rtmStore";
import { usepresentationStore } from "./presentationStore";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { AGORA_APP_ID, MIC_STATE } from "@/constants/routes";
import { AIDenoiserExtension } from "agora-extension-ai-denoiser";
import { useOptionsStore } from "./optionsStore";
import AgoraRTC from "agora-rtc-sdk-ng";
import { RTMEvents } from "agora-rtm-sdk";
import micRequest from "../assets/mic-request.mp3";

interface AudioStore {
    rtcClient: IAgoraRTCClient | null;
    loadingStatus: "success" | "loading" | "error" | "idel";
    networkStatus: "Unknown" | "good" | "mid" | "poor" | "No Connection";
    audioConnectionState: ConnectionState | null;
    micState: MIC_STATE;
    setMicState: (micState: MIC_STATE) => Promise<void>;
    audioTracks: {
        localAudioTrack: ILocalAudioTrack | null;
        remoteAudioTracks: { [key: string]: IRemoteAudioTrack | undefined };
    } | null,
    acceptMicRequest(userId: string, micState: MIC_STATE): Promise<void>;
    leaveAudio: () => void;
    endAudio: ({
        hostEnd
    }: { hostEnd: boolean }) => Promise<void>;
    fetchRtcToken: () => Promise<void>;
    startAudio: () => Promise<void>;
    activeNoiceSuppression(audioTrack: ILocalAudioTrack): Promise<void>;
    init: () => Promise<void>;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
    rtcClient: null,
    loadingStatus: "idel",
    networkStatus: "Unknown",
    audioConnectionState: null,
    audioTracks: null,
    micState: MIC_STATE.MIC_OFF,
    setMicState: async function (micState) {
        try {
            set({ micState });
            if (micState === MIC_STATE.CAN_SPK) {
                get().audioTracks?.localAudioTrack?.setMuted(false);
            } else {
                get().audioTracks?.localAudioTrack?.setMuted(true);
            }
            const presentation = usepresentationStore.getState().presentation;
            const userName = usepresentationStore.getState().userName;
            const tokens = useRtmStore.getState().token;
            if (presentation && tokens) {
                await useRtmStore.getState().rtm?.presence.setState(presentation.liveId, "MESSAGE", {
                    id: tokens.rtcUid,
                    userName,
                    micState
                });

                if (presentation.User === "HOST") {
                    useRtmStore.setState({ host: { id: tokens.rtcUid, userName, micState } });
                    return;
                }

                const usersTemp = { ...useRtmStore.getState().users };
                usersTemp[tokens.rtcUid] = { id: tokens.rtcUid, userName, micState };
                useRtmStore.setState({ users: usersTemp });
            }
        } catch (_: unknown) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to change mic state"
            });
        }
    },
    acceptMicRequest: async function (userId: string, micState: MIC_STATE) {
        try {
            const rtm = useRtmStore.getState().rtm;
            if (rtm) {
                await rtm.publish(userId, micState, {
                    channelType: "USER"
                });
            }
        } catch (_: unknown) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "Failed to accept mic request"
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
                audioTracks: null
            });
        });
    },
    endAudio: async function ({ hostEnd }: { hostEnd: boolean }) {
        try {
            const rtm = useRtmStore.getState().rtm;
            const presentation = usepresentationStore.getState().presentation;

            if (!rtm || !presentation) throw new Error("RTM or Presenatation is null");

            await rtm?.presence.setState(presentation.liveId, "MESSAGE", {
                id: "null",
                userName: "null",
                micState: "null"
            });
            if (presentation.User === "HOST") {
                const userUid = useRtmStore.getState().token?.rtcUid;
                await rtm?.publish(presentation.liveId, "END_AUDIO");
                await axios.put(
                    `/api/v1/ppt/presentations/make-audio/${presentation.id}`,
                    {},
                    { params: { endOrStart: "end", userUid } }
                );
            }
            useRtmStore.setState({ host: null, users: {} });
            get().leaveAudio();


            if (presentation.User === "HOST" || hostEnd) {
                usepresentationStore.setState({ presentation: { ...presentation, audio: false } });
            }

        } catch (_) {
            const presentation = usepresentationStore.getState().presentation;
            if (presentation) {
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: `There was a problem ${presentation.User === "HOST" ? "ending" : "leaving"} the call`
                });
            }
        }
    },
    fetchRtcToken: async function () {
        try {
            const presentation = usepresentationStore.getState().presentation;
            const userUid = useRtmStore.getState().token?.rtcUid;
            if (!presentation) throw new Error("No presentation data");
            const { data } = await axios.get<{
                rtcToken: string;
            }>(`/api/v1/ppt/presentations/present/token/${presentation.liveId}`, {
                params: { userUid }
            });
            useRtmStore.setState((state) => ({
                token: {
                    rtcToken: data.rtcToken,
                    rtcUid: state.token?.rtcUid || "",
                    rtmToken: state.token?.rtmToken || ""
                }
            }));
        } catch (_) { /*  */ }
    },
    startAudio: async function () {
        try {
            const presentation = usepresentationStore.getState().presentation;
            const tokens = useRtmStore.getState().token;
            if (!presentation?.live) {
                throw new Error("Presentation is not live");
            }
            if (tokens?.rtcToken) {
                await get().init();
            } else {
                if (presentation.User === "GUEST") {
                    await get().fetchRtcToken();
                } else {
                    const { data } = await axios.put<{
                        rtcToken: string;
                    }>(
                        `/api/v1/ppt/presentations/make-audio/${presentation.id}`,
                        {},
                        { params: { userUid: tokens?.rtcUid, endOrStart: "start" } }
                    );
                    useRtmStore.setState((state) => ({
                        token: {
                            rtcToken: data.rtcToken,
                            rtcUid: state.token?.rtcUid || "",
                            rtmToken: state.token?.rtmToken || ""
                        }
                    }));
                }
                await get().init();
            }


            const rtm = useRtmStore.getState().rtm;

            if (presentation.User === "HOST" && !presentation.audio) {
                await rtm?.publish(presentation.liveId, "START_AUDIO");
            }
            usepresentationStore.setState((state) => ({ presentation: { ...state.presentation!, audio: true } }));
        } catch (err) {
            toast({
                title: "Error",
                variant: "destructive",
                description: "An error occurred"
            });
        }
    },
    activeNoiceSuppression: async function (audioTrack: ILocalAudioTrack) {
        const setNoiseProcessor = useOptionsStore.getState().setDenoiseProcessor;
        const toggleNoiseSuppression = useOptionsStore.getState().toggleNoiseSuppression;
        const setNoiseSuppressionAvailable = useOptionsStore.getState().setNoiseSuppressionAvailable;
        try {
            const denoiser = new AIDenoiserExtension({ assetsPath: "/external" });


            if (!denoiser.checkCompatibility()) {
                toggleNoiseSuppression(false);
                setNoiseSuppressionAvailable(false);
                return;
            }
            AgoraRTC.registerExtensions([denoiser]);

            const processor = denoiser.createProcessor();
            processor.on("loaderror", function (e: unknown) {
                console.log("loaderror", e);
                toggleNoiseSuppression(false);
                setNoiseSuppressionAvailable(false);
            });

            processor.on("overload", async function () {
                console.log("overload");
                toggleNoiseSuppression(false);
                await processor.disable();
            });

            audioTrack.pipe(processor).pipe(audioTrack.processorDestination);
            await processor.enable();
            setNoiseProcessor(processor);
            toggleNoiseSuppression(true);
            setNoiseSuppressionAvailable(true);
        } catch (error) {
            console.log(error);
            toggleNoiseSuppression(false);
            setNoiseSuppressionAvailable(false);
        }
    },
    init: async function () {
        try {
            set({ loadingStatus: "loading" });
            const rtcClient = RTC.createClient({ mode: "rtc", codec: "vp8" });

            rtcClient.on("connection-state-change", function (state) {
                set({ audioConnectionState: state });
            });

            rtcClient.on("user-published", async (user, mediaType) => {
                await rtcClient?.subscribe(user, mediaType);

                if (mediaType == "audio") {
                    if (!user.audioTrack) return;
                    const audioTracks = get().audioTracks;
                    if (audioTracks) {
                        set((state) => ({
                            audioTracks: {
                                localAudioTrack: state.audioTracks?.localAudioTrack || null,
                                remoteAudioTracks: {
                                    ...state.audioTracks?.remoteAudioTracks,
                                    [user.uid]: user.audioTrack || undefined
                                }
                            }
                        }));
                        user.audioTrack?.play();
                    }
                }
            });

            rtcClient.on("user-left", (user) => {
                useRtmStore.getState().removeUser(user.uid);
                set((state) => ({
                    audioTracks: {
                        localAudioTrack: state.audioTracks?.localAudioTrack || null,
                        remoteAudioTracks: {
                            ...state.audioTracks?.remoteAudioTracks,
                            [user.uid]: undefined
                        }
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

            if (!presentation || !token) throw new Error("Failed to start audio");

            await rtcClient.join(AGORA_APP_ID, presentation.liveId, token.rtcToken, token.rtcUid);
            const localAudioTrack = await RTC.createMicrophoneAudioTrack({
                encoderConfig: "speech_low_quality"
            });

            await rtcClient.publish(localAudioTrack);

            await get().activeNoiceSuppression(localAudioTrack);

            set((state) => ({ audioTracks: { localAudioTrack, remoteAudioTracks: state.audioTracks?.remoteAudioTracks || {} } }));

            get().setMicState(presentation.User === "HOST" ? MIC_STATE.MIC_MUTED : MIC_STATE.MIC_OFF);

            const rtm = useRtmStore.getState().rtm;
            if (!rtm || !token) throw new Error("RTM or Token not set");
            const userDataChange = useRtmStore.getState().handleUserDataChange();
            const presencesEvent = useRtmStore.getState().presencesEvent;
            rtm.addEventListener("presence", function (data: RTMEvents.PresenceEvent) {
                if (data.eventType === "REMOTE_STATE_CHANGED" && presentation.User === "HOST") {
                    userDataChange(data);
                    return;
                }

                presencesEvent(data);
            });

            await rtm.presence.setState(presentation.liveId, "MESSAGE", {
                id: token.rtcUid,
                userName: presentation.User === "HOST" ? "HOST" : useRtmStore.getState().userName,
                micState: presentation.User === "HOST" ? MIC_STATE.MIC_MUTED : MIC_STATE.MIC_OFF
            });
            if (presentation.User === "GUEST") {
                await rtm.subscribe(token.rtcUid);
            }

            const data = await rtm.presence.getOnlineUsers(presentation.liveId, "MESSAGE", {
                includedState: true
            });

            console.log(data);

            type UserType = {
                [key: string]: {
                    id: string;
                    userName: string;
                    micState: MIC_STATE
                }
            };

            const tempUsrs: UserType = {};
            for (let i = 0; i < data.occupants.length; i++) {
                const u = data.occupants[i];
                if (u.states.userName === "HOST") {
                    const host = {
                        id: u.userId,
                        userName: u.states.userName,
                        micState: u.states.micState as MIC_STATE
                    };
                    useRtmStore.setState({ host });
                    continue
                };
                if (Object.keys(u.states).length === 0) continue;
                if (u.states.id === "null") continue;
                tempUsrs[u.userId] = {
                    id: u.userId,
                    userName: u.states.userName,
                    micState: u.states.micState as MIC_STATE
                };
            }

            useRtmStore.setState({ users: tempUsrs });

            const audio = new Audio(micRequest);
            audio.volume = 1;
            audio.load();

            useRtmStore.setState({ audio });

            set({
                loadingStatus: "success",
                rtcClient
            })
        } catch (error: unknown) {
            set({ loadingStatus: "error" });
            get().leaveAudio();
        }
    }
}));
