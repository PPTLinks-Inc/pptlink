export interface ContentItem {
    id: string;
    type: "VIDEO" | "PPT";
    file?: File;
    name: string;
    status: "waiting" | "starting" | "uploading" | "processing" | "error" | "done";
}
export interface Section {
    id: string;
    title: string;
    contents: ContentItem[];
}

export interface CourseStore {
    courseId: string;
    sections: Section[];
    setSections: (sections: Section[]) => void;
    selectedSectionIndex: number;
    setSelectedSectionIndex: (index: number) => void;
    setContentItems: (contentItems: ContentItem[]) => void;
    removeContentItem: (id: string) => void;
    handleSectionTitleChange: (title: string) => void;
    addSection: () => Promise<{order: number, id: string}>;
    removeSection: (id: string) => Promise<void>;
    selectSection: (id: string) => void;
    uploadQueue: string[];
    canUpload: () => boolean;
    addToUploadQueue: (contentId: string) => void;
    processUploadQueue: () => void;
    uploadContent: (contentId: string) => Promise<void>;
}