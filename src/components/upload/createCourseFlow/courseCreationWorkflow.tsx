import { useRef, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDragIndicator } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
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
import {
  ContentItem,
  CourseSideBarContext,
  Section
} from "@/contexts/courseSideBarContext";
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
    setSections,
    addSection,
    removeSection,
    selectSection,
    selectedSectionIndex,
    setContentItems,
    handleSectionTitleChange
  } = useContext(CourseSideBarContext);

  const contentItems = sections[selectedSectionIndex].content;

  const videoInputRef = useRef<HTMLInputElement>(null);
  const pptInputRef = useRef<HTMLInputElement>(null);

  // const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Focus effect for new sections
  useEffect(() => {
    if (newlyCreatedSection !== null) {
      newSectionRef.current?.focus();
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [newlyCreatedSection]);

  // Reset newly created section when changing selection
  useEffect(() => {
    if (
      newlyCreatedSection &&
      sections[selectedSectionIndex].id !== newlyCreatedSection.id
    ) {
      setNewlyCreatedSection(null);
    }
  }, [selectedSectionIndex, newlyCreatedSection, sections]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any, type: "section" | "content") {
    const { active, over } = event;

    if (active.id === over.id) return;

    if (type === "section") {
      setSections((section) => {
        const originalPos = section.findIndex((s) => s.id === active.id);
        const newPos = section.findIndex((s) => s.id === over.id);

        return arrayMove(section, originalPos, newPos);
      });
      selectSection(over.id);
      return;
    }

    const originalPos = contentItems.findIndex((item) => item.id === active.id);
    const newPos = contentItems.findIndex((item) => item.id === over.id);

    setContentItems(arrayMove(contentItems, originalPos, newPos));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-[green]");
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-[green]");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-[green]");
    }

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        addContentItem("video", file);
      } else if (file.name.match(/\.(ppt|pptx)$/i)) {
        addContentItem("presentation", file);
      }
    });
  }

  function addContentItem(type: "video" | "presentation", file: File) {
    const ppttypes = [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/wps-office.pptx"
    ];

    if (!file.type.startsWith("video/") && !ppttypes.includes(file.type)) {
      return;
    }

    const newContentItem: ContentItem = {
      type,
      file,
      name: file.name,
      id: Math.max(0, ...contentItems.map((s) => s.id)) + 1
    };

    setContentItems([...contentItems, newContentItem]);
  }

  function handleFileSelect(type: "video" | "presentation", file: File | null) {
    if (file) {
      addContentItem(type, file);
    }
  }

  // Modified addSection handler
  function handleAddSection() {
    const newId = addSection();
    setNewlyCreatedSection({
      id: newId,
      initialTitle: `Section ${newId}`
    });
  }

  function handleTitleBlur(value: string) {
    if (
      newlyCreatedSection &&
      sections[selectedSectionIndex].id === newlyCreatedSection.id &&
      value === newlyCreatedSection.initialTitle
    ) {
      setModal((prev) => ({ ...prev, isTriggered: true }));
      setNewlyCreatedSection(null);
    }
    handleSectionTitleChange(value);
  }

  function handleNamelessSectionDelete(e: React.FormEvent) {
    e.preventDefault();
    removeSection(sections[selectedSectionIndex].id);

    setModal((prev) => ({ ...prev, isTriggered: false }));
  }

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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={(e) => handleDragEnd(e, "section")}
          >
            <SortableContext
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  newSectionRef={newSectionRef}
                  section={section}
                  newlyCreated={newlyCreatedSection?.id === section.id}
                  selectSection={selectSection}
                  active={selectedSectionIndex === index}
                  removeSection={removeSection}
                  showDelete={sections.length > 1}
                />
              ))}
            </SortableContext>
          </DndContext>

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
          className="w-full sm:w-1/2 p-4 relative border-2"
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
                onChange={(e) => {
                  setNewlyCreatedSection(null);
                  handleSectionTitleChange(e.target.value);
                }}
                onBlur={(e) => handleTitleBlur(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 mb-4">
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const numOfFiles = e.target.files?.length || 0;
                  for (let i = 0; i < numOfFiles; i++) {
                    handleFileSelect("video", e.target.files?.[i] || null);
                  }
                }}
              />
              <input
                type="file"
                ref={pptInputRef}
                className="hidden"
                accept=".ppt,.pptx"
                multiple
                onChange={(e) => {
                  const numOfFiles = e.target.files?.length || 0;
                  for (let i = 0; i < numOfFiles; i++) {
                    handleFileSelect(
                      "presentation",
                      e.target.files?.[i] || null
                    );
                  }
                }}
              />
              <button
                className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
                onClick={() => videoInputRef.current?.click()}
              >
                <IoVideocamOutline />
                <span className="ml-2">Add Video</span>
              </button>
              <button
                className="w-fit flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
                onClick={() => pptInputRef.current?.click()}
              >
                <HiOutlineDocumentText />
                <span className="ml-2">Add Presentation</span>
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
            onDragEnd={(e) => handleDragEnd(e, "content")}
          >
            <div className="mt-4 h-full rounded overflow-y-auto">
              <SortableContext
                items={contentItems}
                strategy={verticalListSortingStrategy}
              >
                {contentItems.map((item) => (
                  <ContentItems key={item.id} content={item} />
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

function SectionItem({
  newSectionRef,
  section,
  newlyCreated,
  selectSection,
  active,
  removeSection,
  showDelete
}: {
  newSectionRef: React.RefObject<HTMLDivElement>;
  section: Section;
  newlyCreated: boolean;
  selectSection: (id: number) => void;
  active: boolean;
  removeSection: (id: number) => void;
  showDelete: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      style={style}
      ref={newlyCreated ? newSectionRef : setNodeRef}
      className={`p-2 mb-2 rounded cursor-pointer flex justify-start items-center ${active ? "bg-gray-300" : "hover:bg-gray-200"}`}
      onClick={() => selectSection(section.id)}
    >
      <span {...attributes} {...listeners} className="block cursor-move">
        <MdDragIndicator />
      </span>
      <div className="w-full flex items-center justify-between">
        <p title={section.title}>{section.title}</p>
        {showDelete && (
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
    </div>
  );
}

function ContentItems({ content }: { content: ContentItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: content.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  const { removeContentItem } = useContext(CourseSideBarContext);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 w-full px-2 py-4 rounded mb-2 flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2 w-full">
        <span {...attributes} {...listeners} className="block cursor-move">
          <MdDragIndicator />
        </span>
        <div className="flex items-center w-full">
          {content.type === "video" ? (
            <IoVideocamOutline className="mr-2" />
          ) : (
            <HiOutlineDocumentText className="mr-2" />
          )}
          <span
            title={content.name}
            className="cursor-text block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {content.name}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="text-red-500 hover:text-red-700 cursor-pointer"
          type="button"
          title="Edit"
        >
          <FaRegEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            removeContentItem(content.id);
          }}
          title="Delete"
          className="text-red-500 hover:text-red-700 cursor-pointer"
          type="button"
        >
          <FaRegTrashCan className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
