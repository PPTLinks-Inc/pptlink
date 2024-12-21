import { create } from "zustand";
import { useRtmStore } from "./rtmStore";
import { usepresentationStore } from "./presentationStore";
import safeAwait from "@/util/safeAwait";
import retryWithBackoff from "@/util/retryWithBackoff";

export interface Message {
    id: string;
    type: "text" | "image";
    content: string;
    sender: string;
    senderId: string;
    time: string;
    images?: string[]; // Add this line for image URLs
    sendingStatus: "sending" | "success" | "failed";
}

interface MessageStore {
    readMessages: { [key: string]: Message };
    unReadMessages: Message[];
    addReadMessage: (messages: Message[]) => void;
    addUnreadMessage: (message: Message) => void;
    sendMessage: ({
        id,
        type,
        content,
        sender,
        senderId
    }: Message) => Promise<void>;
    resetStore: () => void;
}

export const useMessageStore = create<MessageStore>(function (set, get) {
    return {
        readMessages: {},
        unReadMessages: [],
        addReadMessage: (messages) => {
            const newMessages = messages.reduce((acc, message) => {
                acc[message.id] = message;
                return acc;
            }, {} as { [key: string]: Message });

            set((state) => ({ readMessages: { ...state.readMessages, ...newMessages } }));
        },
        addUnreadMessage: (message) => set((state) => ({ unReadMessages: [...state.unReadMessages, message] })),
        sendMessage: async (message) => {
            const rtm = useRtmStore.getState().rtm;
            const liveId = usepresentationStore.getState().presentation?.liveId;

            get().addReadMessage([message]);

            if (!rtm || !liveId) {
                set({ readMessages: { ...get().readMessages, [message.id]: { ...message, sendingStatus: "failed" } } });
                return
            };
            const [err] = await safeAwait(retryWithBackoff(rtm.publish(liveId, JSON.stringify(message))));
            if (err) {
                set({ readMessages: { ...get().readMessages, [message.id]: { ...message, sendingStatus: "failed" } } });
                return;
            }
            set({ readMessages: { ...get().readMessages, [message.id]: { ...message, sendingStatus: "success" } } });
        },
        resetStore: function () {
            set({ readMessages: {}, unReadMessages: [] });
        }
    }
});