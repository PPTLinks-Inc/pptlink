
export interface ContentItem {
    id: string;
    type: "video" | "presentation";
    file: File;
    name: string;
}
export interface Section {
    id: string;
    title: string;
    content: ContentItem[];
}

export interface CourseStore {
    sections: Section[];
    setSections: (sections: Section[]) => void;
    selectedSectionIndex: number;
    setSelectedSectionIndex: (index: number) => void;
    setContentItems: (contentItems: ContentItem[]) => void;
    removeContentItem: (id: string) => void;
    handleSectionTitleChange: (title: string) => void;
    addSection: () => string;
    removeSection: (id: string) => void;
    selectSection: (id: string) => void;
}