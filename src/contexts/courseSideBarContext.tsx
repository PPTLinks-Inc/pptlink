import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from "@/components/ui/sidebar";
import { IoBookOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import logo_white from "/imgs/WHITE.png";
import { Button } from "@/components/ui/button";
import { FaRegSave } from "react-icons/fa";
import React, { createContext, useState } from "react";
import { Link } from "react-router-dom";

interface Section {
  id: number;
  title: string;
  content: string[];
}

export const CourseSideBarContext = createContext<{
  sections: Section[];
  addSection: () => void;
  removeSection: (id: number) => void;
  selectedSectionIndex: number;
  selectSection: (id: number) => void;
  handleSectionTitleChange: (title: string) => void;
}>({
  sections: [],
  addSection: () => {},
  removeSection: () => {},
  selectedSectionIndex: 0,
  selectSection: () => {},
  handleSectionTitleChange: () => {}
});

export default function CourseSideBarContextProvider({
  children,
  isActive
}: {
  children: React.ReactNode;
  isActive: "course" | "settings";
}) {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction to the Course",
      content: []
    }
  ]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  function handleSectionTitleChange(title: string) {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[selectedSectionIndex].title = title;
      return newSections;
    });
  }

  const generateUniqueId = () => {
    return Math.max(0, ...sections.map((s) => s.id)) + 1;
  };

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        id: generateUniqueId(),
        title: `Section ${generateUniqueId()}`,
        content: []
      }
    ]);
  };

  const removeSection = (id: number) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  function selectSection(id: number) {
    setSelectedSectionIndex(sections.findIndex((s) => s.id === id));
  }

  return (
    <CourseSideBarContext.Provider
      value={{
        sections,
        addSection,
        removeSection,
        selectedSectionIndex,
        selectSection,
        handleSectionTitleChange
      }}
    >
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenuButton asChild>
              <Link to="/">
                <img src={logo_white} className="block w-8 aspect-square" />
                <span className="font-bold">PPTLinks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>
          <SidebarContent className="mt-5">
            <SidebarMenuButton
              tooltip="Create a new course"
              className="mx-auto"
              isActive={isActive === "course"}
              asChild
            >
              <Link to="/create-course3/course">
                <IoBookOutline />
                <span className="text-lg">Courses</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={isActive === "settings"}
              tooltip="Course Settings"
              className="mx-auto"
              asChild
            >
              <Link to="/create-course3/settings">
                <GoGear />
                <span className="text-lg">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>Course Builder</p>

            <Button className="ml-auto" variant="outline">
              <FaRegSave />
              <span>Save</span>
            </Button>
          </header>
          <div className="bg-primaryTwo h-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </CourseSideBarContext.Provider>
  );
}
