import { SERVER_URL } from "@/constants/routes";
import axios from "axios";

const BASE_URL = SERVER_URL;


export const standardFetch = axios.create({
    baseURL: BASE_URL
});

export const authFetch = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

