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

export interface CourseData {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    thumbnailKey: string;
    categoryId: string;
    published: boolean;
    price: number;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    CourseSection: Section[];
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
    addSection: () => Promise<{ order: number, id: string }>;
    removeSection: (id: string) => Promise<void>;
    selectSection: (id: string) => void;
    saveCourseData: () => Promise<void>;
    uploadQueue: string[];
    canUpload: () => boolean;
    addToUploadQueue: (contentId: string) => void;
    processUploadQueue: () => void;
    uploadContent: (contentId: string) => Promise<void>;
}