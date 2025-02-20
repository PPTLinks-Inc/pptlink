import { ActiveTab } from "@/contexts/courseSideBarContext";
import { DateRange } from "react-day-picker";

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
    thumbnail: string | null;
    categoryId: string;
    published: boolean;
    price: number;
    creatorId: string;
    enrollmentDateFrom: string;
    enrollmentDateTo: string;
    startDate: string;
    duration: string;
    courseLevel: string;
    maxStudents: number;
    updatedAt: string;
    CourseSection: Section[];
    instructors: {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        instructor: {
            experience?: string;
            role?: string;
            bio?: string;
            photo?: string;
            user: {
                id: string;
                email: string;
                username: string;
            }
        }
    }[];
}

type dataTypes = "name" | "description" | "categoryId" | "published" | "price" | "enrollmentDateFrom" | "enrollmentDateTo" | "startDate" | "duration" | "courseLevel" | "maxStudents" | "thumbnail";

export interface CourseStore {
    courseId: string;

    name: string;
    description: string;
    thumbnail: File | string | null;
    categoryId: string;
    published: boolean;
    price: number;
    creatorId: string;
    enrollmentDateFrom: Date;
    enrollmentDateTo: Date;
    startDate: Date;
    duration: string;
    courseLevel: string;
    maxStudents: number;
    updatedAt: Date;

    instructors: {
        id: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        instructor: {
            experience?: string;
            role?: string;
            bio?: string;
            photo?: string;
            user: {
                id: string;
                email: string;
                username: string;
            }
        }
    }[];

    updateValues: (newValue: string | number | boolean | Date | DateRange | File | null, data: dataTypes) => void;

    sections: Section[];
    setSections: (sections: Section[]) => void;
    selectedSectionIndex: number;
    setSelectedSectionIndex: (index: number) => void;
    setContentItems: (contentItems: ContentItem[]) => void;
    removeContentItem: (id: string) => Promise<void>;
    handleSectionTitleChange: (title: string) => void;
    addSection: () => Promise<{ order: number, id: string }>;
    removeSection: (id: string) => Promise<void>;
    selectSection: (id: string) => void;
    saveCourseData: (currentTab: ActiveTab) => Promise<void>;
    uploadQueue: string[];
    canUpload: () => boolean;
    addToUploadQueue: (contentId: string) => void;
    processUploadQueue: () => void;
    uploadContent: (contentId: string) => Promise<void>;

    addInstructor: (instructorId: string) => Promise<void>;
    removeInstructor: (instructorId: string) => Promise<void>;
}