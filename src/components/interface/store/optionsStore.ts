import { create } from "zustand";
import { useAudioStore } from "./audioStore";
import safeAwait from "@/util/safeAwait";
import { toast } from "@/hooks/use-toast";
import { useModalStore } from "./modalStore";

interface OptionsStore {
    toggleScreenMinimize: () => void;
    toggleScreenShare: () => Promise<void>;
};

export const useOptionsStore = create<OptionsStore>(function () {
    return {
        toggleScreenMinimize: function () {
            useAudioStore.setState((state) => ({ screenShareMinimized: !state.screenShareMinimized }));
        },
        toggleScreenShare: async function () {
            const screenShareEnabled = useAudioStore.getState().screenShareEnabled;
            if (!screenShareEnabled) {
                const [err] = await safeAwait(useAudioStore.getState().startScreenShare());

                if (err) {
                    toast({
                        description: err.message.includes("NOT_SUPPORTED") ? "This browser does not support screen sharing" : "Failed to start screen share",
                        variant: "destructive"
                    });
                    useAudioStore.setState({ screenShareEnabled: false });
                    return;
                }

                toast({
                    description: "Screen share started"
                });
                return;
            }

            useModalStore.getState().stopScreenShare();
        }
    };
});
