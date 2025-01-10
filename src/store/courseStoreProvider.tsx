import { createContext, useContext } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { CourseStore } from "./courseStore";

// eslint-disable-next-line react-refresh/only-export-components
export const CourseContext = createContext<StoreApi<CourseStore> | undefined>(
  undefined
);

interface CourseStoreProviderProps extends React.PropsWithChildren {}

export default function CourseStoreProvider({
  children
}: CourseStoreProviderProps) {
  const store = createStore<CourseStore>((set) => ({
    sections: [
      {
        id: "1",
        title: "Introduction to the Course",
        content: []
      }
    ],
    setSections: (sections) => set({ sections }),
    selectedSectionIndex: 0,
    setSelectedSectionIndex: (index: number) =>
      set({ selectedSectionIndex: index }),
    setContentItems: (contentItems) => {
      set((state) => {
        const newSections = [...state.sections];
        newSections[state.selectedSectionIndex].content = contentItems;
        return { sections: newSections };
      });
    },
    removeContentItem: (id: string) => {
      set((state) => {
        const newSections = [...state.sections];
        const content = newSections[state.selectedSectionIndex].content;
        newSections[state.selectedSectionIndex].content = content.filter(
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
    addSection: () => {
      const newId = generateUniqueId();
      set((state) => ({
        sections: [
          ...state.sections,
          {
            id: newId,
            title: `Section ${newId}`,
            content: []
          }
        ],
        selectedSectionIndex: state.sections.length
      }));
      return newId;
    },
    removeSection: (id: string) => {
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
    }
  }));

  function generateUniqueId(): string {
    return (
      Math.max(0, ...store.getState().sections.map((s) => parseInt(s.id))) + 1
    ).toString();
  }

  return (
    <CourseContext.Provider value={store}>{children}</CourseContext.Provider>
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
