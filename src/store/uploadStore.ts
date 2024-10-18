import { create } from "zustand";

interface UploadStore {
    currentView: number;
    setCurrentView: (view: number) => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    privacy: "PUBLIC" | "PRIVATE" | "TEMP" | "";
    setPrivacy: (privacy: "PUBLIC" | "PRIVATE" | "TEMP") => void;
    downloadable: boolean;
    setDownloadable: (downloadable: boolean) => void;
    categories: {
        id: string;
        name: string;
    }[];
    setCategories: (categories: { id: string, name: string }[]) => void;
    addCategory: (name: string) => void;
    selectedCategory: { id: string, name: string };
    setSelectedCategory: (category: { id: string, name: string }) => void;
    pdfUrl: string;
    setPdfUrl: (url: string) => void;
    processingFile: boolean;
    setProcessingFile: (value: boolean) => void;

    presentersName: string;
    setPresentersName: (name: string) => void;
    bio: string;
    setBio: (bio: string) => void;
    socialLinks: string;
    setSocialLinks: (socialLinks: string) => void;
    date: string;
    setDate: (date: string) => void;
    startTime: string;
    setStartTime: (startTime: string) => void;
    endTime: string;
    setEndTime: (endTime: string) => void;

    uploadStageSubmitHandler: () => void;
    setUloadStageSubmitHandler: (handler: () => void) => void;
    informationStageSubmitHandler: () => void;
    setInformationStageSubmitHandler: (handler: () => void) => void;
    savePresentationStageHandler: () => void;
    setSavePresentationStageHandler: (handler: () => void) => void;
    moveView: (direction: "next" | "back") => void;

    isSaving: boolean;
    setIsSaving: (value: boolean) => void;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
    currentView: 1,
    setCurrentView: (view: number) => set({ currentView: view }),
    title: "",
    setTitle: (title) => set({ title }),
    description: "",
    setDescription: (description) => set({ description }),
    privacy: "PUBLIC",
    setPrivacy: (privacy) => set({ privacy }),
    downloadable: true,
    setDownloadable: (downloadable) => set({ downloadable }),
    categories: [],
    setCategories: (categories) => set({ categories }),
    addCategory: (category) => set({ categories: [...get().categories, { id: "new", name: category }] }),
    selectedCategory: { id: "", name: "" },
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    pdfUrl: "",
    setPdfUrl: (url) => set({ pdfUrl: url }),
    processingFile: false,
    setProcessingFile: (value) => set({ processingFile: value }),

    presentersName: "",
    setPresentersName: (name) => set({ presentersName: name }),
    bio: "",
    setBio: (bio) => set({ bio }),
    socialLinks: "",
    setSocialLinks: (socialLinks) => set({ socialLinks }),
    date: "",
    setDate: (date) => set({ date }),
    startTime: "",
    setStartTime: (startTime) => set({ startTime }),
    endTime: "",
    setEndTime: (endTime) => set({ endTime }),

    uploadStageSubmitHandler: () => { },
    setUloadStageSubmitHandler: (handler) => {
        set({ uploadStageSubmitHandler: handler });
    },
    informationStageSubmitHandler: () => { },
    setInformationStageSubmitHandler: (handler) => {
        set({ informationStageSubmitHandler: handler });
    },
    savePresentationStageHandler: () => { },
    setSavePresentationStageHandler: (handler) => {
        set({ savePresentationStageHandler: handler })
    },
    moveView: (direction) => {
        const currentView = get().currentView;
        if (direction === "next") {
            if (currentView === 1) {
                get().uploadStageSubmitHandler();
            } else if (currentView === 2) {
                get().informationStageSubmitHandler();
            } else if (currentView === 3) {
                get().savePresentationStageHandler();
            }
        } else {
            if (currentView === 2) {
                set({ currentView: 1 });
            } else if (currentView === 3) {
                set({ currentView: 2 });
            }
        }
    },
    isSaving: false,
    setIsSaving: (value) => set({ isSaving: value })
}));