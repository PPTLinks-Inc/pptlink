import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdDragIndicator } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
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
import { ContentItem, Section } from "@/store/courseStore";
import PopUpModal from "../../Models/dashboardModel";
import { useCourseStore } from "@/store/courseStoreProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { authFetch } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { LoadingAssetSmall2 } from "@/assets/assets";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function CourseContentLoader({ params }: LoaderFunctionArgs<any>) {
  const { data } = await authFetch.get(
    `/api/v1/course/content/${params.courseId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );

  return data;
}

export default function CourseCreationWorkflow() {
  const [newlyCreatedSection, setNewlyCreatedSection] = useState<{
    id: string;
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

  const toast = useToast();

  const sections = useCourseStore((state) => state.sections);
  const setSections = useCourseStore((state) => state.setSections);
  const selectedSectionIndex = useCourseStore(
    (state) => state.selectedSectionIndex
  );
  const selectSection = useCourseStore((state) => state.selectSection);
  const setContentItems = useCourseStore((state) => state.setContentItems);
  const addSection = useCourseStore((state) => state.addSection);
  const handleSectionTitleChange = useCourseStore(
    (state) => state.handleSectionTitleChange
  );
  const removeSection = useCourseStore((state) => state.removeSection);
  const addToUploadQueue = useCourseStore((state) => state.addToUploadQueue);

  const contentItems = sections[selectedSectionIndex]?.contents;

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

  const handleAddSection = useMutation({
    mutationFn: function () {
      return addSection();
    },
    onSuccess: (data) => {
      toast.toast({
        title: "Section created"
      });
      setNewlyCreatedSection({
        id: data.id,
        initialTitle: `Section ${data.order}`
      });
    },
    onError: () => {
      toast.toast({
        title: "Failed to create section",
        variant: "destructive"
      });
    }
  });

  const handleRemoveSection = useMutation({
    mutationFn: function (id: string) {
      return removeSection(id);
    },
    onSuccess: () => {
      toast.toast({
        title: "Section deleted"
      });
    },
    onError: () => {
      toast.toast({
        title: "Failed to delete section",
        variant: "destructive"
      });
    }
  });

  if (!sections[selectedSectionIndex]) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any, type: "section" | "content") {
    const { active, over } = event;

    if (active.id === over.id) return;

    if (type === "section") {
      const originalPos = sections.findIndex((s) => s.id === active.id);
      const newPos = sections.findIndex((s) => s.id === over.id);
      const newSection = arrayMove(sections, originalPos, newPos);
      setSections(newSection);
      selectSection(active.id);
      return;
    }

    if (!contentItems) return;

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
        addContentItem("VIDEO", file);
      } else if (file.name.match(/\.(ppt|pptx)$/i)) {
        addContentItem("PPT", file);
      }
    });
  }

  function addContentItem(type: ContentItem["type"], file: File) {
    const ppttypes = [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/wps-office.pptx"
    ];

    if (!file.type.startsWith("video/") && !ppttypes.includes(file.type)) {
      return;
    }

    if (!contentItems) return;

    const newContentItem: ContentItem = {
      type,
      file,
      name: file.name,
      status: "starting",
      id: `new-${(
        Math.max(0, ...contentItems.map((s) => parseInt(s.id))) + 1
      ).toString()}`
    };

    setContentItems([...contentItems, newContentItem]);
    addToUploadQueue(newContentItem.id);
  }

  function handleFileSelect(type: ContentItem["type"], file: File | null) {
    if (file) {
      addContentItem(type, file);
    }
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
    // removeSection(sections[selectedSectionIndex].id);
    handleRemoveSection.mutate(sections[selectedSectionIndex].id);

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
        <div className="w-full sm:w-1/4 h-full !bg-slate-200 p-4 border-r overflow-y-auto">
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
                  removeSection={handleRemoveSection.mutateAsync}
                  showDelete={
                    sections.length > 1 || !handleRemoveSection.isPending
                  }
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center bg-primaryTwo"
            onClick={() => handleAddSection.mutate()}
          >
            {handleAddSection.isPending ? (
              <LoadingAssetSmall2 />
            ) : (
              <>
                <FaPlus className="w-5 h-5 mr-2" />
                <span>Add Section</span>
              </>
            )}
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
                    handleFileSelect("VIDEO", e.target.files?.[i] || null);
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
                    handleFileSelect("PPT", e.target.files?.[i] || null);
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
          {contentItems && (
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
          )}
        </div>

        <div className="w-full sm:w-1/4 bg-slate-200 p-4 border-l overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview</h2>
          </div>
          <div className="bg-slate-200 p-4 rounded">
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
  selectSection: (id: string) => void;
  active: boolean;
  removeSection: (id: string) => Promise<void>;
  showDelete: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = useCallback(
    function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setDeleting(true);
      removeSection(section.id)
        .then(function () {
          setDeleting(false);
          setModalOpen(false);
        })
        .catch(function () {
          setDeleting(false);
          setModalOpen(false);
        });
    },
    [section.id, removeSection]
  );

  const handleClose = useCallback(function () {
    setModalOpen(false);
  }, []);

  const handleOpen = useCallback(function (
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.stopPropagation();
    setModalOpen(true);
  }, []);

  return (
    <>
      <PopUpModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={deleting}
        darkLoader={false}
        message="Do you want to delete this section?"
        actionText="Delete"
        oneButton={false}
        bgColor="bg-primaryTwo"
        textColor="text-[#FFFFF0]"
        borderColor="border-[#FFFFF0]"
      />
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
              onClick={handleOpen}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
            >
              <FaRegTrashCan className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ContentItems({ content }: { content: ContentItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: content.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  const removeContentItem = useCourseStore((state) => state.removeContentItem);

  const [name, setName] = useState(content.name);
  const [file, setFile] = useState<File | null>(null);

  const statusColor = useMemo(
    function () {
      switch (content.status) {
        case "starting":
          return "text-blue-700 bg-blue-100";
        case "uploading":
          return "text-yellow-700 bg-yellow-100";
        case "processing":
          return "text-orange-700 bg-orange-100";
        case "error":
          return "text-red-700 bg-red-100";
        case "done":
          return "text-green-700 bg-green-100";
        default:
          return "text-gray-700 bg-gray-100";
      }
    },
    [content.status]
  );

  const setContentItems = useCourseStore((state) => state.setContentItems);
  const contentItems = useCourseStore(
    (state) => state.sections[state.selectedSectionIndex].contents
  );
  const addToUploadQueue = useCourseStore((state) => state.addToUploadQueue);

  function addContentItem() {
    let updatedContent: ContentItem = {
      ...content,
      name
    };


    const ppttypes = [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
      "application/wps-office.pptx"
    ];

    if (!file) {
      setContentItems(
        contentItems.map((c) => (c.id === content.id ? updatedContent : c))
      );
      return;
    }

    if (!file.type.startsWith("video/") && !ppttypes.includes(file.type)) {
      return;
    }

    updatedContent = {
      ...content,
      type: file.type.startsWith("video/") ? "VIDEO" : "PPT",
      status: "waiting",
      file,
      name
    };

    setContentItems(
      contentItems.map((c) => (c.id === content.id ? updatedContent : c))
    );
    addToUploadQueue(updatedContent.id);
  }

  function handleFileSelect(file: File | null) {
    if (file) {
      setFile(file);
    }
  }

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit course Media</DialogTitle>
          <DialogDescription>
            {
              "Make changes to your course Media here. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="file">File</Label>
            <Input
              type="file"
              accept=".ppt,.pptx,video/*"
              onChange={(e) => {
                handleFileSelect(e.target.files?.[0] || null);
              }}
              id="file"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={addContentItem}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
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
            {content.type === "VIDEO" ? (
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
        <p className={cn("p-2 rounded-md flex", statusColor)}>
          <span>・</span>
          {content.status}
        </p>
        {(content.status === "done" || content.status === "error") && (
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <button
                className="text-red-500 hover:text-red-700 cursor-pointer"
                type="button"
                title="Edit"
              >
                <FaRegEdit className="w-4 h-4" />
              </button>
            </DialogTrigger>
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
        )}
      </div>
    </Dialog>
  );
}
