import { AIDenoiserProcessor } from "agora-extension-ai-denoiser";
import { create } from "zustand";
import { useAudioStore } from "./audioStore";
import safeAwait from "@/util/safeAwait";
import { toast } from "@/hooks/use-toast";

interface OptionsStore {
    noiseSuppressionEnabled: boolean;
    noiseSuppressionAvailable: boolean;
    denoiseProcessor: AIDenoiserProcessor | null;
    setDenoiseProcessor: (processor: AIDenoiserProcessor) => void;
    setNoiseSuppressionAvailable: (value: boolean) => void;
    toggleNoiseSuppression: (value: boolean) => void;
    toggleScreenShare: () => Promise<void>;
};

export const useOptionsStore = create<OptionsStore>(function (set) {
    return {
        noiseSuppressionEnabled: false,
        noiseSuppressionAvailable: false,
        denoiseProcessor: null,
        setDenoiseProcessor: (processor) => {
            set({ denoiseProcessor: processor });
        },
        setNoiseSuppressionAvailable: (value) => {
            set({ noiseSuppressionAvailable: value });
        },
        toggleNoiseSuppression: (value) => {
            set(function (state) {
                if (state.denoiseProcessor) {
                    if (value) {
                        state.denoiseProcessor.enable();
                        return { ...state, noiseSuppressionEnabled: true };
                    }
                    state.denoiseProcessor.disable();
                    return { ...state, noiseSuppressionEnabled: false };
                }

                return state;
            });
        },
        toggleScreenShare: async function () {
            const screenShareEnabled = useAudioStore.getState().screenShareEnabled;
            if (!screenShareEnabled) {
                const [err] = await safeAwait(useAudioStore.getState().startScreenShare());

                if (err) {
                    toast({
                        description: "Failed to start screen share",
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

            const [err] = await safeAwait(useAudioStore.getState().stopScreenShare());
            if (err) {
                toast({
                    description: "Failed to stop screen share",
                    variant: "destructive"
                });
                return;
            }
            toast({
                description: "Screen share stopped"
            });
        }
    };
});
