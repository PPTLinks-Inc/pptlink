export interface presentationData {
    id: string;
    name: string;
    User: "HOST" | "GUEST" | "CO-HOST";
    status: "NOT_LIVE" | "LIVE" | "AUDIO";
    liveId: string;
    pptLink: string;
    pdfLink: string;
    downloadable: boolean;
    presenter: string;
    thumbnail: string;
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
}