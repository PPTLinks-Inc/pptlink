import { useMemo } from "react";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineQuiz, MdDragIndicator } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
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
import { ContentItem } from "@/store/courseStore";
import { cn } from "@/lib/utils";

interface MobileCourseContentProps {
  contentItems: ContentItem[];
  onContentReorder: (items: ContentItem[]) => void;
  onEditContent: (item: ContentItem) => void;
  onDeleteContent: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  className?: string;
}

export default function MobileCourseContent({
  contentItems,
  onContentReorder,
  onEditContent,
  onDeleteContent,
  onDragOver,
  onDragLeave,
  onDrop,
  className
}: MobileCourseContentProps) {
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

    // Find the content item being dragged
    const draggedItem = contentItems.find((item) => item.id === active.id);
    if (!draggedItem) return;

    // Prevent dragging if item is being processed or uploaded
    if (
      draggedItem.status === "processing" ||
      draggedItem.status === "uploading"
    ) {
      return;
    }

    const originalPos = contentItems.findIndex((item) => item.id === active.id);
    const newPos = contentItems.findIndex((item) => item.id === over.id);

    onContentReorder(arrayMove(contentItems, originalPos, newPos));
  }

  return (
    <div className={cn("flex-1 overflow-hidden flex flex-col", className)}>
      {/* Drop Zone */}
      <div
        className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-600 text-sm">
            Drop files here or use the header buttons
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports videos and presentations
          </p>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4">
        {contentItems && contentItems.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={contentItems}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {contentItems.map((item) => (
                  <MobileContentItem
                    key={item.id}
                    content={item}
                    onEdit={() => onEditContent(item)}
                    onDelete={() => onDeleteContent(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineDocumentText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content added yet
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Start by adding videos, presentations, or quizzes to this section
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileContentItemProps {
  content: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
}

function MobileContentItem({ content, onEdit, onDelete }: MobileContentItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const statusColor = useMemo(() => {
    switch (content.status) {
      case "starting":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "uploading":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "processing":
        return "text-orange-700 bg-orange-100 border-orange-200";
      case "error":
        return "text-red-700 bg-red-100 border-red-200";
      case "done":
        return "text-green-700 bg-green-100 border-green-200";
      case "not_active":
        return "text-gray-700 bg-gray-100 border-gray-200";
      case "waiting":
        return "text-gray-700 bg-gray-100 border-gray-200";
      case "active":
        return "text-pink-700 bg-pink-100 border-pink-200";
      case "completed":
        return "text-gray-700 bg-gray-100 border-gray-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  }, [content.status]);

  const getIcon = () => {
    switch (content.type) {
      case "VIDEO":
        return <IoVideocamOutline size={24} className="text-blue-600" />;
      case "QUIZ":
        return <MdOutlineQuiz size={24} className="text-purple-600" />;
      case "PPT":
        return <HiOutlineDocumentText size={24} className="text-orange-600" />;
      default:
        return <HiOutlineDocumentText size={24} className="text-gray-600" />;
    }
  };

  const canInteract = content.status !== "uploading" && content.status !== "processing";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200",
        isDragging && "shadow-lg",
        !canInteract && "opacity-60"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...(canInteract ? { ...attributes, ...listeners } : {})}
            className={cn(
              "flex-shrink-0 p-1 rounded",
              canInteract 
                ? "cursor-move text-gray-400 hover:text-gray-600 hover:bg-gray-100" 
                : "cursor-not-allowed text-gray-300"
            )}
          >
            <MdDragIndicator size={20} />
          </div>

          {/* Icon */}
          <div className="flex-shrink-0">
            {getIcon()}
          </div>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-medium text-gray-900 truncate mb-2">
              {content.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                statusColor
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                {content.status}
                {content.uploadProgress && content.status === "uploading" && (
                  <span className="ml-1">{content.uploadProgress}%</span>
                )}
              </span>
            </div>

            {/* Progress Bar for Uploading */}
            {content.status === "uploading" && content.uploadProgress && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${content.uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {canInteract && (content.status === "done" || content.status === "error" || content.type === "QUIZ") && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Edit content"
              >
                <FaRegEdit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete content"
              >
                <FaRegTrashCan size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {content.file && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Size: {(content.file.size / (1024 * 1024)).toFixed(2)} MB</span>
              <span>Type: {content.type}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
