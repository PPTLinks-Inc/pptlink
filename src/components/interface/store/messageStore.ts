import { create } from "zustand";
import { useRtmStore } from "./rtmStore";
import { usepresentationStore } from "./presentationStore";

export interface Message {
    type: "text" | "image";
    content: string;
    sender: string;
    senderId: string;
    time: string;
}

interface MessageStore {
    readMessages: Message[];
    unReadMessages: Message[];
    addReadMessage: (messages: Message[]) => void;
    addUnreadMessage: (message: Message) => void;
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
    }) => Promise<void>;
}

export const useMessageStore = create<MessageStore>(function(set) {
    return {
        readMessages: [],
        unReadMessages: [],
        addReadMessage: (messages) => set((state) => ({ readMessages: [...state.readMessages, ...messages] })),
        addUnreadMessage: (message) => set((state) => ({ unReadMessages: [...state.unReadMessages, message] })),
        sendMessage: async (message) => {
            // Send message to server
            // set((state) => ({ messages: [...state.messages, message] }));
            const rtm = useRtmStore.getState().rtm;
            const liveId = usepresentationStore.getState().presentation?.liveId;

            if (!rtm || !liveId) return;
            await rtm.publish(liveId, JSON.stringify(message));
        }
    }
});