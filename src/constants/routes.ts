/* eslint-disable no-undef */
export enum MIC_STATE {
  REQ_MIC = "REQ_MIC",
  CAN_SPK = "CAN_SPK",
  MIC_OFF = "MIC_OFF",
  MIC_MUTED = "MIC_MUTED"
};

export const SERVER_URL = import.meta.env?.VITE_BACKEND_URL ?? "https://api.pptlinks.com";
// export const SERVER_URL = "https://verbose-telegram-q44qrpxqrvpcgjr-4000.app.github.dev";

export const ROUTER_ID = "courseRoot";

export const FLW_PUBLIC_KEY = import.meta.env?.VITE_FLW_PUBLIC_KEY ?? "FLWPUBK_TEST-f9c069130b91a7dc2a7930386caa51a9-X";

export const AGORA_APP_ID = "33672aae3d8d48f4b83292008db3986e";

export const HOME = "/";

export const INSTITUTIONS = "/institutions";

export const INSTITUTIONS_ID = "/institutions/:id";

export const ABOUT = "/about";

export const DASHBOARD = "/dashboard";

export const LEGAL = "/legal";

export const UPLOAD = "/upload";

export const SIGNUP = "/signup";

export const LOGIN = "/login";

export const DOCUMENT = "/documentation";

export const TERMS_AND_SERVICES = "/terms-and-services";

export const PRIVACY_POLICY = "/privacy-policy";
