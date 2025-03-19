import { createContext, useContext, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { ContentItem, CourseData, CourseStore } from "./courseStore";
import { authFetch, standardFetch } from "@/lib/axios";
import { useParams } from "react-router-dom";
import safeAwait from "@/util/safeAwait";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { ActiveTab } from "@/contexts/courseSideBarContext";
import useCourseContent from "@/hooks/useCourseContent";

// eslint-disable-next-line react-refresh/only-export-components
export const CourseContext = createContext<StoreApi<CourseStore> | undefined>(
  undefined
);

interface CourseStoreProviderProps extends React.PropsWithChildren {}

const checkProcessingStatus = async (
  courseId: string,
  sectionId: string,
  contentId: string,
  contentIndex: number,
  sectionIndex: number,
  set: (fn: (state: CourseStore) => Partial<CourseStore>) => void
) => {
  const [err, res] = await safeAwait(
    authFetch.get<{ status: ContentItem["status"] }>(
      `/api/v1/course/check-processing-status/${courseId}/${sectionId}/${contentId}`
    )
  );

  if (err) {
    console.error(err);
    return false;
  }

  if (res.data.status === "done") {
    set((state) => {
      const newSections = [...state.sections];
      if (newSections[sectionIndex]?.contents[contentIndex]) {
        newSections[sectionIndex].contents[contentIndex].status = "done";
      }
      return { sections: newSections };
    });
    return true;
  }
  return false;
};

export default function CourseStoreProvider({
  children
}: CourseStoreProviderProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const storeRef = useRef<StoreApi<CourseStore>>();

  if (!courseId) {
    throw new Error("Course ID is required");
  }

  // const data = useLoaderData() as CourseData;
  const data = useCourseContent(courseId) as CourseData;

  // Only create the store once and reuse it
  if (!storeRef.current) {
    storeRef.current = createStore<CourseStore>((set, get) => ({
      courseId: courseId,

      name: data.name,
      description: data.description,
      thumbnail: data.thumbnail,
      categoryId: data.categoryId,
      published: data.published,
      canPublish: false,
      price: data.price,
      creatorId: data.creatorId,
      enrollmentDateFrom: new Date(data.enrollmentDateFrom),
      enrollmentDateTo: new Date(data.enrollmentDateTo),
      startDate: new Date(data.startDate),
      duration: data.duration,
      courseLevel: data.courseLevel,
      maxStudents: data.maxStudents,
      updatedAt: new Date(data.updatedAt),

      instructors: data.instructors ?? [],

      accountDetails: data.accountDetails ?? null,

      updateValues: (newValue, data) => {
        set({ [data]: newValue });
      },
      sections: data.CourseSection ?? [],
      setSections: (sections) => {
        set({ sections });

        // Start checking processing content
        sections.forEach((section, sectionIndex) => {
          section.contents.forEach((content, contentIndex) => {
            if (content.status === "processing") {
              const intervalId = setInterval(async () => {
                const isDone = await checkProcessingStatus(
                  get().courseId,
                  section.id,
                  content.id,
                  contentIndex,
                  sectionIndex,
                  set
                );
                if (isDone) {
                  clearInterval(intervalId);
                }
              }, 10000);
            }
          });
        });
      },
      selectedSectionIndex: 0,
      setSelectedSectionIndex: (index: number) =>
        set({ selectedSectionIndex: index }),
      setContentItems: (contentItems) => {
        set((state) => {
          const newSections = [...state.sections];
          newSections[state.selectedSectionIndex].contents = contentItems;
          return { sections: newSections };
        });
      },
      removeContentItem: async (id: string) => {
        await authFetch.delete(
          `/api/v1/course/delete-content/${get().courseId}/${get().sections[get().selectedSectionIndex].id}/${id}`
        );

        set((state) => {
          const newSections = [...state.sections];
          const content = newSections[state.selectedSectionIndex].contents;
          if (!content) return { sections: newSections };
          newSections[state.selectedSectionIndex].contents = content.filter(
            (item) => item.id !== id
          );
          return { sections: newSections };
        });
      },
      handleSectionTitleChange: (title: string) => {
        set((state) => {
          const newSections = [...state.sections];
          newSections[state.selectedSectionIndex].title = title;
          return { sections: newSections };
        });
      },
      addSection: async () => {
        const sectionOrder = get().sections.length + 1;

        const { data } = await authFetch.post<{ sectionId: string }>(
          "/api/v1/course/create-section",
          {
            courseId: get().courseId,
            title: `Section ${sectionOrder}`,
            orderNumber: sectionOrder
          }
        );

        set((state) => ({
          sections: [
            ...state.sections,
            {
              id: data.sectionId,
              title: `Section ${sectionOrder}`,
              contents: []
            }
          ],
          selectedSectionIndex: state.sections.length
        }));
        return { order: sectionOrder, id: data.sectionId };
      },
      removeSection: async (id: string) => {
        await authFetch.delete(
          `/api/v1/course/delete-section/${get().courseId}/${id}`
        );

        set((state) => {
          const newSections = state.sections.filter(
            (section) => section.id !== id
          );
          const removedIndex = state.sections.findIndex(
            (section) => section.id === id
          );

          let newSelectedIndex = state.selectedSectionIndex;
          if (newSections.length > 0) {
            if (removedIndex <= state.selectedSectionIndex) {
              newSelectedIndex = Math.max(0, state.selectedSectionIndex - 1);
            }
          } else {
            newSelectedIndex = 0;
          }

          return {
            sections: newSections,
            selectedSectionIndex: newSelectedIndex
          };
        });
      },
      selectSection: (id: string) => {
        set((state) => ({
          selectedSectionIndex: state.sections.findIndex((s) => s.id === id)
        }));
      },
      saveCourseData: async (currentTab, userId) => {
        if (currentTab === "course") {
          const courseData = get().sections;

          await authFetch.put(
            `/api/v1/course/update-course-content/${get().courseId}`,
            courseData
          );

          get().validateCourse();
        } else if (currentTab === "settings") {
          const courseData = new FormData();
          courseData.append("name", get().name);
          courseData.append("description", get().description);
          courseData.append("categoryId", get().categoryId);
          courseData.append("price", get().price.toString());
          courseData.append(
            "enrollmentDateFrom",
            get().enrollmentDateFrom.toISOString()
          );
          courseData.append(
            "enrollmentDateTo",
            get().enrollmentDateTo.toISOString()
          );
          courseData.append("startDate", get().startDate.toISOString());
          courseData.append("duration", get().duration);
          courseData.append("courseLevel", get().courseLevel);
          courseData.append("maxStudents", get().maxStudents.toString());

          const thumbnail = get().thumbnail;
          if (thumbnail instanceof File) {
            courseData.append("thumbnail", thumbnail);
          }

          // Add timezone information
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          courseData.append("timezone", timezone);

          await authFetch.put(
            `/api/v1/course/update-course-settings/${get().courseId}`,
            courseData
          );
        } else if (currentTab === "profile") {
          const instructorUpdates = get()
            .instructors.filter((i) => i.status === "APPROVED")
            .map(({ id, instructor }) => ({
              id,
              role: instructor.role,
              experience: instructor.experience,
              bio: instructor.bio
            }));

          const formData = new FormData();

          // Add instructor data as JSON string
          formData.append("instructors", JSON.stringify(instructorUpdates));

          // Add any instructor photos that are Files
          get().instructors.forEach(({ instructor, id }) => {
            if (instructor.photo instanceof File) {
              formData.append(`photos.${id}`, instructor.photo);
            }
          });

          // Only save account details if verification was successful
          if (get().accountVerification.isValidAccount) {
            const accountDetails = get().accountDetails;
            if (accountDetails) {
              const isCreator = get().creatorId === userId;
              await Promise.all([
                authFetch.put(
                  `/api/v1/course/update-course-profile/${get().courseId}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data"
                    }
                  }
                ),
                isCreator &&
                  authFetch.put(
                    `/api/v1/payment/update-account-details/${get().courseId}`,
                    {
                      account_number: accountDetails.accountNumber,
                      account_bank: accountDetails.bankCode
                    }
                  )
              ]);
            }
          } else {
            await authFetch.put(
              `/api/v1/course/update-course-profile/${get().courseId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            );
          }
        }

        // After successful save, check if course can be published
        const isValid = get().validateCourse();
        set({ canPublish: isValid });
        isValid && set({ missingRequirements: {} });
      },
      uploadQueue: [],
      canUpload: () => {
        const activeUploads = get()
          .sections.flatMap((s) => s.contents)
          .filter(
            (c) => c.status === "uploading" || c.status === "starting"
          ).length;
        return activeUploads < 3;
      },
      addToUploadQueue: (contentId: string) => {
        set((state) => ({
          uploadQueue: [...state.uploadQueue, contentId]
        }));
        get().processUploadQueue();
      },
      processUploadQueue: () => {
        if (!get().canUpload()) return;

        const nextContentId = get().uploadQueue[0];
        if (!nextContentId) return;

        set((state) => ({
          uploadQueue: state.uploadQueue.slice(1)
        }));

        get()
          .uploadContent(nextContentId)
          .finally(() => {
            get().processUploadQueue();
          });
      },
      uploadContent: async function (contentId) {
        const selectedSection = get().sections[get().selectedSectionIndex];

        const contentIndex = selectedSection.contents.findIndex(
          (c) => c.id === contentId
        );
        if (contentIndex === -1) return;

        const content = selectedSection.contents[contentIndex];
        content.status = !content.file ? "error" : "starting";

        set((state) => {
          const newSections = [...state.sections];
          newSections[state.selectedSectionIndex].contents[contentIndex] =
            content;
          return { sections: newSections };
        });

        if (!content.file) return;

        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }

        try {
          const { data } = await authFetch.get(
            "/api/v1/course/generate-upload-url",
            {
              params: {
                contentId: content.id,
                courseId,
                sectionId: selectedSection.id,
                contentType: content.file.type,
                key: `${Date.now()}_${result}.${content.type === "VIDEO" ? "mp4" : "pptx"}`,
                contentOrder: contentIndex + 1,
                name: content.file.name
              }
            }
          );

          set((state) => {
            const newSections = [...state.sections];
            newSections[state.selectedSectionIndex].contents[contentIndex] = {
              ...content,
              status: "uploading",
              id: data.contentId
            };
            return { sections: newSections };
          });

          await standardFetch.put(data.signedUrl, content.file, {
            headers: {
              "Content-Type": content.file.type
            }
          });

          set((state) => {
            const newSections = [...state.sections];
            newSections[state.selectedSectionIndex].contents[contentIndex] = {
              ...content,
              status: "processing",
              id: data.contentId
            };
            return { sections: newSections };
          });

          const intervalId = setInterval(async function () {
            console.log("CHECKING...");
            const isDone = await checkProcessingStatus(
              courseId,
              selectedSection.id,
              data.contentId,
              contentIndex,
              get().selectedSectionIndex,
              set
            );
            if (isDone) {
              clearInterval(intervalId);
            }
          }, 10000);

          console.log(data);
        } catch (error) {
          set((state) => {
            const newSections = [...state.sections];
            newSections[state.selectedSectionIndex].contents[contentIndex] = {
              ...content,
              status: "error"
            };
            return { sections: newSections };
          });
        }
      },
      addInstructor: async (instructorId: string) => {
        const toastId = toast({
          title: "Creating instructor",
          duration: 10000
        });

        const [err, res] = await safeAwait(
          authFetch.post<{
            id: string;
            email: string;
            username: string;
          }>("/api/v1/course/add-instructor", {
            courseId: get().courseId,
            instructorId
          })
        );

        if (err) {
          toastId.dismiss();
          toast({
            title: "Error",
            description: "Failed to add instructor",
            variant: "destructive"
          });
          return;
        }

        const data = res.data;

        set((state) => ({
          instructors: [
            ...state.instructors,
            {
              id: data.id,
              status: "PENDING",
              instructor: {
                experience: "",
                role: "",
                bio: "",
                photo: "",
                user: {
                  id: data.id,
                  email: data.email,
                  username: data.username
                }
              }
            }
          ]
        }));

        toastId.dismiss();
        toast({
          title: "Success",
          description: "Instructor added successfully"
        });
      },
      removeInstructor: async (instructorId: string) => {
        set((state) => ({
          instructors: state.instructors.filter(
            (instructor) => instructor.id !== instructorId
          )
        }));
        const [err] = await safeAwait(
          authFetch.delete(
            `/api/v1/course/delete-instructor/${get().courseId}/${instructorId}`
          )
        );

        if (err) {
          toast({
            title: "Error",
            description: "Failed to remove instructor",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Success",
          description: "Instructor removed successfully"
        });
      },
      setInstructors: (instructors) => {
        set({ instructors });
      },

      updateInstructor: (instructorId, updates) => {
        set((state) => ({
          instructors: state.instructors.map((instructor) => {
            if (instructor.id === instructorId) {
              return {
                ...instructor,
                instructor: {
                  ...instructor.instructor,
                  ...updates
                }
              };
            }
            return instructor;
          })
        }));
      },

      accountVerification: {
        accountName: data.accountDetails?.accountName ?? "",
        accountNumber: data.accountDetails?.accountNumber ?? "",
        bankCode: data.accountDetails?.bankCode ?? "",
        isValidAccount: false,
        isVerifying: false,
        verificationError: ""
      },

      updateAccountDetails: (details) => {
        set({ accountDetails: details });
      },

      updateAccountVerification: (updates) => {
        set((state) => ({
          accountVerification: {
            ...state.accountVerification,
            ...updates
          }
        }));
      },

      verifyAccount: async () => {
        const state = get();
        const { accountNumber, bankCode } = state.accountVerification;

        if (!accountNumber || !bankCode) return;

        set((state) => ({
          accountVerification: {
            ...state.accountVerification,
            isVerifying: true,
            isValidAccount: false,
            accountName: "",
            verificationError: ""
          }
        }));

        try {
          const { data } = await authFetch.post<{
            status: string;
            message: string;
            data: {
              account_number: string;
              account_name: string;
            };
          }>("/api/v1/payment/verify-account-number", {
            account_number: accountNumber,
            account_bank: bankCode
          });

          if (data.status === "error") {
            set((state) => ({
              accountVerification: {
                ...state.accountVerification,
                isVerifying: false,
                isValidAccount: false,
                accountName: "",
                verificationError: data.message
              }
            }));
            return;
          }

          // Update both accountVerification and accountDetails
          const verifiedDetails = {
            accountNumber,
            bankCode,
            accountName: data.data.account_name
          };

          set((state) => ({
            accountVerification: {
              ...state.accountVerification,
              isVerifying: false,
              isValidAccount: true,
              accountName: data.data.account_name,
              verificationError: ""
            },
            accountDetails: verifiedDetails
          }));
        } catch (error) {
          set((state) => ({
            accountVerification: {
              ...state.accountVerification,
              isVerifying: false,
              isValidAccount: false,
              accountName: "",
              verificationError: "Failed to verify account"
            }
          }));
        }
      },
      validateSettings: () => {
        const state = get();
        const dateFrom = new Date(state.enrollmentDateFrom);
        dateFrom.setHours(0, 0, 0, 0);
        const dateTo = new Date(state.enrollmentDateTo);
        dateTo.setHours(0, 0, 0, 0);
        const startDate = new Date(state.startDate);
        startDate.setHours(0, 0, 0, 0);

        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);

        const isValid =
          dateFrom <= dateTo && dateTo <= startDate && dateNow <= dateFrom;
        return !!(
          state.name &&
          state.description &&
          state.categoryId &&
          state.price &&
          isValid &&
          state.duration &&
          state.courseLevel &&
          state.maxStudents &&
          state.thumbnail
        );
      },
      validateProfile: () => {
        const state = get();
        const hasValidInstructors = state.instructors.every(
          (instructor) =>
            instructor.status === "APPROVED" &&
            instructor.instructor.role &&
            instructor.instructor.experience &&
            instructor.instructor.bio
        );

        const hasValidPaymentDetails = !!(
          state.accountDetails?.accountNumber &&
          state.accountDetails?.bankCode &&
          state.accountDetails?.accountName
        );

        return hasValidInstructors && hasValidPaymentDetails;
      },
      validateContent: () => {
        const state = get();
        return (
          state.sections.length > 0 &&
          state.sections.every(
            (section) =>
              section.contents.length > 0 &&
              section.contents.every((content) => content.status === "done")
          )
        );
      },
      validateCourse: () => {
        const state = get();
        return (
          state.validateSettings() &&
          state.validateProfile() &&
          state.validateContent()
        );
      },
      getNextIncompleteTab: () => {
        const state = get();
        if (!state.validateSettings()) return "settings";
        if (!state.validateProfile()) return "profile";
        return "course";
      },
      togglePublish: async () => {
        const state = get();
        const [err, res] = await safeAwait(
          authFetch.put<{ message: string }>(
            `/api/v1/course//toggle-publish/${state.courseId}`
          )
        );

        if (axios.isAxiosError(err)) {
          toast({
            title: "Error",
            description: err.response?.data.message,
            variant: "destructive"
          });
          return;
        }

        if (err) {
          toast({
            title: "Error",
            description: !state.published
              ? "Failed to publish course, make sure all sections are complete"
              : "Failed to unpublish course",
            variant: "destructive"
          });
          return;
        }

        set((state) => ({
          published: !state.published
        }));
        toast({
          title: "Success",
          description: res.data.message
        });
      },
      missingRequirements: {},

      setMissingRequirements: (tab: ActiveTab, requirements: string[]) => {
        set((state) => ({
          missingRequirements: {
            ...state.missingRequirements,
            [tab]: requirements
          }
        }));
      },

      getMissingRequirements: (tab: ActiveTab) => {
        const state = get();
        const missing: string[] = [];

        if (tab === "settings") {
          const dateFrom = new Date(state.enrollmentDateFrom);
          dateFrom.setHours(0, 0, 0, 0);
          const dateTo = new Date(state.enrollmentDateTo);
          dateTo.setHours(0, 0, 0, 0);
          const startDate = new Date(state.startDate);
          startDate.setHours(0, 0, 0, 0);

          const dateNow = new Date();
          dateNow.setHours(0, 0, 0, 0);

          const isValidDate =
            dateFrom <= dateTo && dateTo <= startDate && dateNow <= dateFrom;
          if (!state.name) missing.push("Course title");
          if (!state.description) missing.push("Course description");
          if (!state.categoryId) missing.push("Category");
          if (!state.price) missing.push("Price");
          if (!state.enrollmentDateFrom || !state.enrollmentDateTo)
            missing.push("Enrollment dates");
          if (!state.startDate) missing.push("Start date");
          if (!isValidDate) missing.push("Invalid date range");
          if (!state.duration) missing.push("Course duration");
          if (!state.courseLevel) missing.push("Course level");
          if (!state.maxStudents) missing.push("Maximum students");
          if (!state.thumbnail) missing.push("Course thumbnail");
        }

        if (tab === "profile") {
          if (!state.accountDetails) missing.push("Payment details");
          if (!state.instructors.length)
            missing.push("At least one instructor");
          state.instructors.forEach((instructor, index) => {
            if (!instructor.instructor.role)
              missing.push(`Instructor ${index + 1} role`);
            if (!instructor.instructor.experience)
              missing.push(`Instructor ${index + 1} experience`);
            if (!instructor.instructor.bio)
              missing.push(`Instructor ${index + 1} bio`);
          });
        }

        if (tab === "course") {
          if (!state.sections.length) missing.push("At least one section");
          state.sections.forEach((section, index) => {
            if (!section.contents.length)
              missing.push(`Content in section ${index + 1}`);
            section.contents.forEach((content, contentIndex) => {
              if (content.status !== "done")
                missing.push(
                  `Upload for content ${contentIndex + 1} in section ${index + 1}`
                );
            });
          });
        }

        get().setMissingRequirements(tab, missing);
        return missing;
      }
    }));
  }

  return (
    <CourseContext.Provider value={storeRef.current}>
      {children}
    </CourseContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCourseStore<T>(selector: (store: CourseStore) => T) {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourseStore must be used within a CourseStoreProvider");
  }

  return useStore(context, selector);
}
