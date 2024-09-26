import { RTMClient } from "agora-rtm-sdk";
import { create } from "zustand";

export interface Message {
    type: "text" | "image";
    content: string;
    sender: string;
    senderId: string;
    time: string;
}

interface MessageStore {
    messages: Message[];
    addMessage: (message: Message) => void;
    sendMessage: ({
        type,
        content,
        sender,
        senderId
    }: {
        type: "text" | "image";
        content: string;
        sender: string;
        senderId: string;
    }, rtm: RTMClient, liveId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>(function(set) {
    return {
        messages: [],
        addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
        sendMessage: async (message, rtm, liveId) => {
            // Send message to server
            // set((state) => ({ messages: [...state.messages, message] }));
            await rtm.publish(liveId, JSON.stringify(message));
        }
    }
});