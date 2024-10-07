import { AIDenoiserProcessor } from "agora-extension-ai-denoiser";
import { create } from "zustand";

interface OptionsStore {
    noiseSuppressionEnabled: boolean;
    noiseSuppressionAvailable: boolean;
    denoiseProcessor: AIDenoiserProcessor | null;
    setDenoiseProcessor: (processor: AIDenoiserProcessor) => void;
    setNoiseSuppressionAvailable: (value: boolean) => void;
    toggleNoiseSuppression: (value: boolean) => void;
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
        }
    };
});
