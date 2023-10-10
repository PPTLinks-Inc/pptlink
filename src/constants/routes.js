/* eslint-disable no-undef */
export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

// export const SERVER_URL = "http://10.42.0.1:4000";
// export const SERVER_URL = "http://192.168.0.102:4000";
export const SERVER_URL = "https://pptlink-node-backend.onrender.com";
// https://pptlink-node-backend.onrender.com/

// export const SERVER_URL =
//   process.env.NODE_ENV === 'development' ? 'http://10.42.0.1:4000' : '';

export const HOME = "/";

export const INSTITUTIONS = "/institutions";

export const INSTITUTIONS_ID = "/institutions/:id";

export const ABOUT = "/about";

export const DASHBOARD = "/dashboard";

export const LEGAL = "/legal";

export const UPLOAD = "/upload";

export const SIGNUP = "/signup";

export const LOGIN = "/login";
