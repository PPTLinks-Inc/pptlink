/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { MIC_STATE } from "../../constants/routes";
import { RTMClient, RTMEvents } from "agora-rtm-sdk";
import { ConnectionState, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

export interface presentationData {
    id: string;
    name: string;
    User: "HOST" | "GUEST";
    live: boolean;
    liveId: string;
    audio: boolean;
    pptLink: string;
    pdfLink: string;
    downloadable: boolean;
    presenter: string;
    rtc: {
        rtcUid: string;
        rtcToken: string | undefined;
        rtmToken: string;
    }

}
export interface PresentationContextI {
    fullScreenShow: boolean;
    fullScreenToggle: (value?: boolean) => void;
    isIphone: boolean;
    isMobilePhone: boolean;
    presentation: UseQueryResult<presentationData, Error> | null;
    makeLive: UseMutationResult<never, Error, {
        liveId: string;
        live: boolean;
    }, unknown>;
    micState: MIC_STATE;
    startPrompt: boolean;
    userName: string;
    networkStatus: string;
    startAudio: UseMutationResult<{
        tokens: string;
    } | undefined, Error, {
        liveId: string;
        live: boolean;
        User: "HOST" | "GUEST";
        presentationId: string;
        tokens: presentationData["rtc"];
    }, unknown>;
    endAudio: UseMutationResult<void, Error, {
        User: "HOST" | "GUEST";
        liveId: string;
        presentationId: string;
        hostEnd: boolean;
    }, unknown>;
    synced: boolean;
    rtmConnectionState: RTMEvents.RTMConnectionStatusChangeEvent["state"],
    users: {
        id: string;
        userName: string;
        micState: MIC_STATE;
    }[],
    host: {
        id: string;
        userName: string;
        micState: MIC_STATE;
    } | null,
    audioData: {
        loading: boolean;
        success: boolean;
        error: boolean;
        networkStatus: string;
        setMute: (mute: boolean) => void;
        endAudio: (error?: boolean) => void;
        startAudio: (liveId: string, rtcToken: string, rtcUid: string, removeUsers: (uid: IAgoraRTCRemoteUser["uid"]) => void) => Promise<void>;
    },
    rtm: RTMClient | null;
    audioConnectionState: ConnectionState | null;
    changeMicState(state: MIC_STATE, rtm: RTMClient | null): void;
    acceptMicRequest: (userId: string, micState: MIC_STATE) => Promise<void>;
    setSwiperRef: React.Dispatch<any>;
    setMicState: React.Dispatch<React.SetStateAction<MIC_STATE>>;
    setStartPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    setMute: (mute: boolean) => void;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    syncSlide: () => void;
}
export interface rtmTokenI {
    rtmToken: string;
    rtcUid: string;
}