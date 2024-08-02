/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { MIC_STATE } from "../../constants/routes";
import { RTMEvents } from "agora-rtm-sdk";

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
    makeLive: UseMutationResult<never, Error, void, unknown>;
    setSwiperRef: React.Dispatch<any>;
    micState: MIC_STATE;
    setMicState: React.Dispatch<React.SetStateAction<MIC_STATE>>;
    audioSuccess: boolean;
    startPrompt: boolean;
    setStartPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    audioLoading: boolean;
    audioError: boolean;
    setMute: (mute: boolean) => void;
    joinAudio: boolean;
    setJoinAudio: React.Dispatch<React.SetStateAction<boolean>>;
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    rtcToken: string | null;
    networkStatus: string;
    startAudio: UseMutationResult<{
        rtcToken: string;
    } | undefined, Error, void, unknown>;
    fetchRtcToken: UseMutationResult<{
        rtcToken: string;
    }, Error, void, unknown>;
    synced: boolean;
    syncSlide: () => void;
    rtmConnectionState: RTMEvents.RTMConnectionStatusChangeEvent["state"],
    usersData: {
        success: boolean;
        error: boolean;
        loading: boolean;
        users: {
            id: string;
            userName: string;
            micState: typeof MIC_STATE;
        }[];
    }
}
export interface rtmTokenI {
    rtmToken: string;
    rtcUid: string;
}