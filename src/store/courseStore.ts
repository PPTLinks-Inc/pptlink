import { ActiveTab } from "@/types/course";
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
    accountDetails: {
        accountNumber: string;
        accountName: string;
        bankCode: string;
    } | null;
}

type dataTypes = "name" | "description" | "categoryId" | "price" | "enrollmentDateFrom" | "enrollmentDateTo" | "startDate" | "duration" | "courseLevel" | "maxStudents" | "thumbnail";

export interface InstructorProfileUpdate {
    id: string;
    role?: string;
    experience?: string;
    bio?: string;
    photo?: File;
}

export interface AccountVerificationState {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  isValidAccount: boolean;
  isVerifying: boolean;
  verificationError: string;
}

export interface MissingRequirements {
  settings: string[];
  profile: string[];
  course: string[];
}

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
            photo?: string | File;
            user: {
                id: string;
                email: string;
                username: string;
            }
        }
    }[];

    accountDetails: {
        accountNumber: string;
        accountName: string;
        bankCode: string;
    } | null;

    accountVerification: AccountVerificationState;
    updateAccountVerification: (updates: Partial<AccountVerificationState>) => void;
    verifyAccount: () => Promise<void>;

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
    saveCourseData: (currentTab: ActiveTab, userId: string) => Promise<void>;
    uploadQueue: string[];
    canUpload: () => boolean;
    addToUploadQueue: (contentId: string) => void;
    processUploadQueue: () => void;
    uploadContent: (contentId: string) => Promise<void>;

    addInstructor: (instructorId: string) => Promise<void>;
    removeInstructor: (instructorId: string) => Promise<void>;
    setInstructors: (instructors: CourseStore['instructors']) => void;
    updateInstructor: (instructorId: string, updates: {
        role?: string;
        experience?: string;
        bio?: string;
        photo?: string | File;
    }) => void;

    updateAccountDetails: (details: NonNullable<CourseStore['accountDetails']>) => void;

    validateSettings: () => boolean;
    validateProfile: () => boolean;
    validateContent: () => boolean;
    validateCourse: () => boolean;
    getNextIncompleteTab: () => "course" | "settings" | "profile";

    canPublish: boolean;

    togglePublish: () => Promise<void>;
}