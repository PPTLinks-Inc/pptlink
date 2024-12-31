import { useRef, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useContext } from "react";
import { CourseSideBarContext } from "@/contexts/courseSideBarContext";
import PopUpModal from "../../Models/dashboardModel";

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
        onClose={() => setModal((prev) => ({ ...prev, isTriggered: false }))}
        onSubmit={(e) => handleNamelessSectionDelete(e)}
        isLoading={modal.isLoading}
        message={modal.message}
        actionText={modal.actionText}
        oneButton={false}
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

        <div className="w-full sm:w-1/2 p-4 relative">
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
            <button className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300">
              <IoVideocamOutline />
              <span className="ml-2">Video</span>
            </button>
            <button className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300">
              <HiOutlineDocumentText />
              <span className="ml-2">Document</span>
            </button>
            <button disabled={true} className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300 cursor-not-allowed">
              <MdOutlineQuiz />
              <span className="ml-2">Quiz</span>
            </button>
          </div>

          <div className="border-2 border-dashed min-h-[300px] p-4 bg-gray-50 rounded">
            <div className="text-center text-primaryTwo">
              Drag content blocks here or use the buttons above
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/4 bg-white p-4 border-l overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview</h2>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded">
              Course preview content
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
