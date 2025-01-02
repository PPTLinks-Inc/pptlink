import { useRef, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDragIndicator } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { useContext } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CourseSideBarContext } from "@/contexts/courseSideBarContext";
import PopUpModal from "../../Models/dashboardModel";

interface ContentItem {
  id: number;
  type: "video" | "presentation";
  file: File;
  name: string;
  isEditing?: boolean;
  tempName?: string; // Add this new property
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const getItemPos = (id: number) =>
    contentItems.findIndex((item) => item.id === id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setContentItems((item) => {
      const originalPos = getItemPos(active.id);
      const newPos = getItemPos(over.id);

      return arrayMove(item, originalPos, newPos);
    });
  };

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
    setContentItems((prev) => [
      ...prev,
      {
        type,
        file,
        name: file.name,
        id: Math.max(0, ...contentItems.map((s) => s.id)) + 1
      }
    ]);
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="mt-4 h-full rounded overflow-y-auto">
              <SortableContext
                items={contentItems}
                strategy={verticalListSortingStrategy}
              >
                {contentItems.map((item) => (
                  <ContentItems
                    key={item.id}
                    content={item}
                    setContentItems={setContentItems}
                  />
                ))}
              </SortableContext>
              {contentItems.length === 0 && (
                <div className="bg-gray-100 p-4 rounded">
                  No content items added yet
                </div>
              )}
            </div>
          </DndContext>
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

function ContentItems({
  content,
  setContentItems
}: {
  content: ContentItem;
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: content.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100 px-2 py-4 rounded mb-2 flex items-center justify-start gap-2"
    >
      <span className="block cursor-move">
        <MdDragIndicator />
      </span>
      <div className="flex items-center">
        {content.type === "video" ? (
          <IoVideocamOutline className="mr-2" />
        ) : (
          <HiOutlineDocumentText className="mr-2" />
        )}
        <span className="block w-[350px] maxScreenMobile:w-[200px] overflow-x-hidden whitespace-nowrap text-ellipsis">
          {content.name}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log("Delete button clicked");
          setContentItems((prev) => {
            const newItems = prev.filter((i) => i.id !== content.id);
            console.log("Updated content items:", newItems);
            return newItems;
          });
        }}
        className="text-red-500 hover:text-red-700 cursor-pointer z-50 ml-auto mr-0 p-1"
        type="button"
      >
        <FaRegTrashCan className="w-4 h-4" />
      </button>
    </div>
  );
}
