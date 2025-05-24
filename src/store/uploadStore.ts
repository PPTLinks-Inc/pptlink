export interface UploadStore {
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
    date: string | undefined;
    setDate: (date: string) => void;
    startTime: string | undefined;
    setStartTime: (startTime: string) => void;
    endTime: string | undefined;
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
