import { StoreApi, createStore, useStore } from "zustand";
import { createContext, useContext, useState } from "react";
import { UploadStore } from "./uploadStore";

export const UploadContext = createContext<StoreApi<UploadStore> | undefined>(
  undefined
);

interface UploadStoreProviderProps extends React.PropsWithChildren {}

export default function UploadStoreProvider({
  children
}: UploadStoreProviderProps) {
  const [store] = useState(() =>
    createStore<UploadStore>((set, get) => ({
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
      addCategory: (category) =>
        set({
          categories: [...get().categories, { id: "new", name: category }]
        }),
      selectedCategory: { id: "", name: "" },
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      pdfUrl: "",
      setPdfUrl: (url) => set({ pdfUrl: url }),
<<<<<<< HEAD
      processingFile: false,
      setProcessingFile: (value) => set({ processingFile: value }),
=======
>>>>>>> 1e0a35973e3c09ac86e8878a49518ef039cec88a

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

      uploadStageSubmitHandler: () => {},
      setUloadStageSubmitHandler: (handler) => {
        set({ uploadStageSubmitHandler: handler });
      },
      informationStageSubmitHandler: () => {},
      setInformationStageSubmitHandler: (handler) => {
        set({ informationStageSubmitHandler: handler });
      },
      savePresentationStageHandler: () => {},
      setSavePresentationStageHandler: (handler) => {
        set({ savePresentationStageHandler: handler });
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
      setIsSaving: (value) => set({ isSaving: value }),
    }))
  );

  return (
    <UploadContext.Provider value={store}>{children}</UploadContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUploadStore<T>(selector: (store: UploadStore) => T) {
    const context = useContext(UploadContext);

    if (!context) {
        throw new Error("useUploadStore must be used within a UploadStoreProvider");
    }

    return useStore(context, selector);
}
