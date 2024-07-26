import { RTMClient } from "agora-rtm-sdk";

export default function useAudioUsers(rtm: RTMClient | null, joinedAudio: string[]) {
    console.log("users", joinedAudio);
}
