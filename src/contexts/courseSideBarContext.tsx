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
import { MdHelpOutline } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { MdOutlineFeedback } from "react-icons/md";
import React, { createContext, useState } from "react";
import { Link } from "react-router-dom";

interface Section {
  id: number;
  title: string;
  content: string[];
}

export const CourseSideBarContext = createContext<{
  sections: Section[];
  addSection: () => number;
  removeSection: (id: number) => void;
  selectedSectionIndex: number;
  selectSection: (id: number) => void;
  handleSectionTitleChange: (title: string) => void;
}>({
  sections: [],
  addSection: () => 0,
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
  isActive: "course" | "settings" | "profile" | "feedback" | "help";
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
      // Safety check to ensure the selected section exists
      if (selectedSectionIndex >= prevSections.length) {
        return prevSections;
      }

      const newSections = [...prevSections];
      newSections[selectedSectionIndex].title = title;
      return newSections;
    });
  }

  const generateUniqueId = () => {
    return Math.max(0, ...sections.map((s) => s.id)) + 1;
  };

  const addSection = () => {
    const newId = generateUniqueId();
    setSections((prevSections) => [
      ...prevSections,
      {
        id: newId,
        title: `Section ${newId}`,
        content: []
      }
    ]);
    setSelectedSectionIndex(sections.length);
    return newId; // Return the new section ID
  };

  const removeSection = (id: number) => {
    setSections((prevSections) => {
      const newSections = prevSections.filter((section) => section.id !== id);
      const removedIndex = prevSections.findIndex(
        (section) => section.id === id
      );
      // Update selectedSectionIndex
      if (newSections.length > 0) {
        if (removedIndex <= selectedSectionIndex) {
          // If we removed the selected section or a section before it,
          // move selection up by one (or stay at 0)
          setSelectedSectionIndex(Math.max(0, selectedSectionIndex - 1));
        }
      } else {
        // If no sections remain, reset to 0
        setSelectedSectionIndex(0);
      }

      return newSections;
    });
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
            <SidebarMenuButton asChild tooltip="Go to Home">
              <Link to="/">
                <img src={logo_white} className="block w-8 aspect-square" />
                <span className="font-bold">PPTLinks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>
          <SidebarContent className="mt-5">
            <SidebarMenuButton
              tooltip="Course content"
              className="mx-auto"
              isActive={isActive === "course"}
              asChild
            >
              <Link to="/create-course/course">
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
              <Link to="/create-course/settings">
                <GoGear />
                <span className="text-lg">Settings</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={isActive === "profile"}
              tooltip="Course profile"
              className="mx-auto"
              asChild
            >
              <Link to="/create-course/profile">
                <AiOutlineProfile />
                <span className="text-lg">Profile</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={isActive === "feedback"}
              tooltip="Course feedback"
              className="mx-auto"
              asChild
            >
              <Link to="/create-course/feedback">
                <MdOutlineFeedback />
                <span className="text-lg">Feedback</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
              isActive={isActive === "help"}
              tooltip="Help"
              className="mx-auto mt-auto mb-4"
              asChild
            >
              <Link to="/create-course/help">
                <MdHelpOutline />
                <span className="text-lg">Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>Course Builder</p>
            <div className="ml-auto mr-0 flex justify-center items-center gap-4">
              <Button className="ml-auto" variant="outline">
                <FaRegSave />
                <span>Save</span>
              </Button>

              <Button
                className="ml-auto bg-primaryTwo text-white border-white"
                variant="outline"
              >
                <span>Next</span>
              </Button>
            </div>
          </header>
          <div className="bg-primaryTwo h-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </CourseSideBarContext.Provider>
  );
}
