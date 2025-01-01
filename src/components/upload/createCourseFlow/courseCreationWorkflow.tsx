import { useRef, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDragIndicator } from "react-icons/md";
import { useContext } from "react";
import { CourseSideBarContext } from "@/contexts/courseSideBarContext";
import PopUpModal from "../../Models/dashboardModel";

interface ContentItem {
  type: "video" | "presentation";
  file: File;
  name: string;
}

export default function CourseCreationWorkflow() {
  const [newlyCreatedSection, setNewlyCreatedSection] = useState<{
    id: number;
    initialTitle: string;
  } | null>(null);
  const newSectionRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState({
    isTriggered: false,
    isLoading: false,
    message:
      "Section title wasn't changed. Do you want to delete this section?",
    actionText: "Delete",
    sectionId: ""
  });
  const {
    sections,
    addSection,
    removeSection,
    selectSection,
    selectedSectionIndex,
    handleSectionTitleChange
  } = useContext(CourseSideBarContext);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const pptInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    video: File | null;
    presentation: File | null;
  }>({
    video: null,
    presentation: null
  });

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("borde-[red]");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("borde-[red]");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("borde-[red]");
    }

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        addContentItem("video", file);
      } else if (file.name.match(/\.(ppt|pptx)$/i)) {
        addContentItem("presentation", file);
      }
    });
  };

  const addContentItem = (type: "video" | "presentation", file: File) => {
    setContentItems((prev) => [...prev, { type, file, name: file.name }]);
  };

  const handleFileSelect = (
    type: "video" | "presentation",
    file: File | null
  ) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [type]: file
    }));
    if (file) {
      addContentItem(type, file);
    }
  };

  // Focus effect for new sections
  useEffect(() => {
    if (newlyCreatedSection !== null) {
      newSectionRef.current?.focus();
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [newlyCreatedSection]);

  // Modified addSection handler
  const handleAddSection = () => {
    const newId = addSection();
    setNewlyCreatedSection({
      id: newId,
      initialTitle: `Section ${sections.length + 1}`
    });
  };

  const handleTitleBlur = (value: string) => {
    if (
      newlyCreatedSection &&
      sections[selectedSectionIndex].id === newlyCreatedSection.id &&
      value === newlyCreatedSection.initialTitle
    ) {
      setModal((prev) => ({ ...prev, isTriggered: true }));
      setNewlyCreatedSection(null);
    }
    handleSectionTitleChange(value);
  };

  const handleNamelessSectionDelete = (e: React.FormEvent) => {
    e.preventDefault();
    removeSection(sections[selectedSectionIndex].id);
    setModal((prev) => ({ ...prev, isTriggered: false }));
  };

  // Reset newly created section when changing selection
  useEffect(() => {
    if (
      newlyCreatedSection &&
      sections[selectedSectionIndex].id !== newlyCreatedSection.id
    ) {
      setNewlyCreatedSection(null);
    }
  }, [selectedSectionIndex, newlyCreatedSection, sections]);

  return (
    <>
      <PopUpModal
        open={modal.isTriggered}
        onClose={() => {
          setModal((prev) => ({ ...prev, isTriggered: false }));
          newSectionRef.current?.focus();
          titleInputRef.current?.focus();
          titleInputRef.current?.select();
        }}
        onSubmit={(e) => handleNamelessSectionDelete(e)}
        isLoading={modal.isLoading}
        message={modal.message}
        actionText={modal.actionText}
        oneButton={false}
        bgColor="bg-primaryTwo"
        textColor="text-[#FFFFF0]"
        borderColor="border-[#FFFFF0]"
      />
      <div className="flex w-full h-full">
        <div className="w-full sm:w-1/4 h-full bg-gray-100 p-4 border-r overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Course Sections</h2>
          </div>

          {sections.map((section, index) => (
            <div
              key={section.id}
              ref={
                newlyCreatedSection?.id === section.id ? newSectionRef : null
              }
              className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${selectedSectionIndex === index ? "bg-gray-300" : "hover:bg-gray-200"}`}
              onClick={() => selectSection(section.id)}
            >
              <div>{section.title}</div>
              {sections.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(section.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <FaRegTrashCan className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center bg-primaryTwo"
            onClick={handleAddSection}
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Add Section
          </button>
        </div>

        <div
          ref={dropZoneRef}
          className="w-full sm:w-1/2 p-4 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="sticky top-0 bg-primaryTwo">
            <div className="flex justify-between items-center mb-4 bg-primaryTwo">
              <input
                ref={titleInputRef}
                type="text"
                value={sections[selectedSectionIndex].title}
                className="text-2xl text-white font-bold w-full border-b pb-2 bg-transparent"
                onChange={(e) => handleSectionTitleChange(e.target.value)}
                onBlur={(e) => handleTitleBlur(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 mb-4">
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                onChange={(e) =>
                  handleFileSelect("video", e.target.files?.[0] || null)
                }
              />
              <input
                type="file"
                ref={pptInputRef}
                className="hidden"
                accept=".ppt,.pptx"
                onChange={(e) =>
                  handleFileSelect("presentation", e.target.files?.[0] || null)
                }
              />
              <button
                className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
                onClick={() => videoInputRef.current?.click()}
              >
                <IoVideocamOutline />
                <span className="ml-2">
                  {/* {selectedFiles.video ? selectedFiles.video.name : "Add Video"} */}
                  Add Video
                </span>
              </button>
              <button
                className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
                onClick={() => pptInputRef.current?.click()}
              >
                <HiOutlineDocumentText />
                <span className="ml-2">
                  {/* {selectedFiles.presentation
                  ? selectedFiles.presentation.name
                  : "Add Presentation"} */}
                  Add Presentation
                </span>
              </button>
              <button
                disabled={true}
                className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-not-allowed"
              >
                <MdOutlineQuiz />
                <span className="ml-2">Add Quiz</span>
              </button>
            </div>

            <div className="border-2 border-dashed bg-gray-50 rounded transition-colors">
              <div className="px-2 py-4 text-center text-primaryTwo">
                Drag content blocks here or use the buttons above
              </div>
            </div>
          </div>
          <div className="mt-4 min-h-[50px] rounded overflow-y-auto">
            {contentItems.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 px-2 py-4 rounded mb-2 flex items-center justify-start gap-2"
              >
                <span className="block ">
                  <MdDragIndicator />
                </span>
                <div className="flex items-center">
                  {item.type === "video" ? (
                    <IoVideocamOutline className="mr-2" />
                  ) : (
                    <HiOutlineDocumentText className="mr-2" />
                  )}
                  <span className="overflow-x-hidden whitespace-nowrap text-ellipsis">{item.name}</span>
                </div>
                <button
                  onClick={() =>
                    setContentItems((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashCan className="w-4 h-4" />
                </button>
              </div>
            ))}
            {contentItems.length === 0 && (
              <div className="bg-gray-100 p-4 rounded">
                No content items added yet
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/4 bg-white p-4 border-l overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            No content items added yet
          </div>
        </div>
      </div>
    </>
  );
}
