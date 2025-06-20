import { SERVER_URL } from "@/constants/routes";
import axios from "axios";

const BASE_URL = SERVER_URL;


export const standardFetch = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
});

export const authFetch = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    // withCredentials: true
});

export function setAuthFetchToken(token: string | undefined) {
    if (!token) return;

    localStorage.setItem("accessToken", token);
    authFetch.defaults.headers["Authorization"] = `Bearer ${token}`;
}
