import { useState, useRef, useCallback, useEffect } from "react";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { useMobileGestures } from "./MobileGestureHandler";
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
import { Section } from "@/store/courseStore";
import { LoadingAssetSmall2 } from "@/assets/assets";
import { cn } from "@/lib/utils";
import PopUpModal from "../../Models/dashboardModel";

interface MobileCourseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  selectedSectionIndex: number;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  onRemoveSection: (id: string) => Promise<void>;
  onSectionsReorder: (sections: Section[]) => void;
  onSectionTitleChange: (title: string) => void;
  isAddingSectionLoading?: boolean;
  newlyCreatedSection?: { id: string; initialTitle: string } | null;
  className?: string;
}

export default function MobileCourseSidebar({
  isOpen,
  onClose,
  sections,
  selectedSectionIndex,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onSectionsReorder,
  onSectionTitleChange,
  isAddingSectionLoading = false,
  newlyCreatedSection,
  className
}: MobileCourseSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = sections.findIndex((s) => s.id === active.id);
    const newPos = sections.findIndex((s) => s.id === over.id);
    const newSections = arrayMove(sections, originalPos, newPos);
    onSectionsReorder(newSections);
    onSelectSection(active.id);
  }

  // Close sidebar when clicking backdrop on mobile
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gesture handlers for mobile
  const sidebarRef = useMobileGestures({
    onSwipeLeft: onClose, // Swipe left to close sidebar
    threshold: 100
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 w-full max-w-sm bg-slate-200 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Course Sections</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section, index) => (
                <MobileSectionItem
                  key={section.id}
                  section={section}
                  isActive={selectedSectionIndex === index}
                  isNewlyCreated={newlyCreatedSection?.id === section.id}
                  onSelect={() => {
                    onSelectSection(section.id);
                    onClose(); // Close sidebar when selecting on mobile
                  }}
                  onRemove={onRemoveSection}
                  onTitleChange={onSectionTitleChange}
                  showDelete={sections.length > 1}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Add Section Button */}
        <div className="p-4 border-t border-gray-300 bg-white">
          <button
            className="w-full bg-primaryTwo hover:bg-primaryTwo/90 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
            onClick={onAddSection}
            disabled={isAddingSectionLoading}
          >
            {isAddingSectionLoading ? (
              <LoadingAssetSmall2 />
            ) : (
              <>
                <FaPlus size={18} />
                <span>Add Section</span>
              </>
            )}
          </button>
        </div>

        {/* Course Stats */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Sections:</span>
              <span className="font-medium">{sections.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Content:</span>
              <span className="font-medium">
                {sections.reduce((total, section) => total + section.contents.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface MobileSectionItemProps {
  section: Section;
  isActive: boolean;
  isNewlyCreated: boolean;
  onSelect: () => void;
  onRemove: (id: string) => Promise<void>;
  onTitleChange: (title: string) => void;
  showDelete: boolean;
}

function MobileSectionItem({
  section,
  isActive,
  isNewlyCreated,
  onSelect,
  onRemove,
  onTitleChange,
  showDelete
}: MobileSectionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(isNewlyCreated);
  const [title, setTitle] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = useCallback(
    function (e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setDeleting(true);
      onRemove(section.id)
        .then(() => {
          setDeleting(false);
          setModalOpen(false);
        })
        .catch(() => {
          setDeleting(false);
          setModalOpen(false);
        });
    },
    [section.id, onRemove]
  );

  const handleClose = useCallback(function () {
    setModalOpen(false);
  }, []);

  const handleDeleteClick = useCallback(function (e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  }, []);

  const handleTitleSubmit = () => {
    setIsEditing(false);
    onTitleChange(title);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(section.title);
      setIsEditing(false);
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
    }
  };

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
        ref={setNodeRef}
        style={style}
        className={cn(
          "mb-3 rounded-lg border-2 transition-all duration-200",
          "bg-white shadow-sm",
          isActive 
            ? "border-primaryTwo bg-primaryTwo/5 shadow-md" 
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
          isDragging && "shadow-lg"
        )}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-move p-1 text-gray-400 hover:text-gray-600 transition-colors touch-none"
            >
              <MdDragIndicator size={20} />
            </div>

            {/* Section Content */}
            <div className="flex-1 min-w-0" onClick={onSelect}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleTitleKeyPress}
                  onClick={handleTitleClick}
                  className="w-full text-lg font-medium bg-transparent border-b border-primaryTwo focus:outline-none"
                />
              ) : (
                <div onClick={handleTitleClick} className="cursor-pointer">
                  <h3 className={cn(
                    "text-lg font-medium truncate transition-colors",
                    isActive ? "text-primaryTwo" : "text-gray-900"
                  )}>
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {section.contents.length} item{section.contents.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Delete Button */}
            {showDelete && !isEditing && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete section"
              >
                <FaRegTrashCan size={16} />
              </button>
            )}
          </div>

          {/* Section Progress Indicators */}
          {!isEditing && section.contents.length > 0 && (
            <div className="mt-3 flex gap-2">
              {['waiting', 'uploading', 'processing', 'error'].map((status) => {
                const count = section.contents.filter(c => c.status === status).length;
                if (count === 0) return null;
                
                const colors = {
                  waiting: 'bg-blue-100 text-blue-700',
                  uploading: 'bg-yellow-100 text-yellow-700',
                  processing: 'bg-orange-100 text-orange-700',
                  error: 'bg-red-100 text-red-700'
                };

                return (
                  <span
                    key={status}
                    className={cn(
                      'px-2 py-1 text-xs rounded-full font-medium',
                      colors[status as keyof typeof colors]
                    )}
                  >
                    {count} {status}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
