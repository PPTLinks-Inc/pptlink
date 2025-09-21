import { useState } from "react";
import { FaArrowLeft, FaRegEdit, FaBars } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { IoVideocamOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdOutlineQuiz } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileCourseHeaderProps {
  sectionTitle: string;
  onSectionTitleChange: (title: string) => void;
  onSectionTitleBlur: (title: string) => void;
  onAddVideo: () => void;
  onAddPresentation: () => void;
  onAddQuiz: () => void;
  onToggleSidebar: () => void;
  onGoBack: () => void;
  isEditingTitle?: boolean;
  className?: string;
}

export default function MobileCourseHeader({
  sectionTitle,
  onSectionTitleChange,
  onSectionTitleBlur,
  onAddVideo,
  onAddPresentation,
  onAddQuiz,
  onToggleSidebar,
  onGoBack,
  isEditingTitle = false,
  className
}: MobileCourseHeaderProps) {
  const [isEditing, setIsEditing] = useState(isEditingTitle);
  const [showActions, setShowActions] = useState(false);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    onSectionTitleBlur(e.target.value);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onSectionTitleBlur(e.currentTarget.value);
    }
  };

  return (
    <header className={cn(
      "bg-primaryTwo text-white w-full min-h-[80px] flex flex-col relative z-50",
      "md:hidden", // Only show on mobile
      className
    )}>
      {/* Main Header Bar */}
      <div className="flex items-center justify-between p-4 min-h-[60px]">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onGoBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft size={18} />
          </button>
          
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars size={18} />
          </button>
        </div>

        {/* Center Section - Title */}
        <div className="flex items-center gap-2 flex-2 max-w-[60%]">
          {isEditing ? (
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => onSectionTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              className="bg-transparent text-white text-lg font-semibold text-center border-b border-white/30 focus:border-white outline-none px-2 py-1 min-w-0 w-full"
              autoFocus
              placeholder="Section title"
            />
          ) : (
            <button
              onClick={handleTitleClick}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors min-w-0"
            >
              <span className="text-lg font-semibold truncate">
                {sectionTitle || "Untitled Section"}
              </span>
              <FaRegEdit size={16} className="text-white/70 flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle actions"
          >
            <FiUploadCloud size={20} />
          </button>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        showActions ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex items-center gap-2 px-4 pb-4">
          <Button
            onClick={onAddVideo}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 h-12 gap-2"
            variant="outline"
          >
            <IoVideocamOutline size={18} />
            <span className="text-sm">Video</span>
          </Button>
          
          <Button
            onClick={onAddPresentation}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 h-12 gap-2"
            variant="outline"
          >
            <HiOutlineDocumentText size={18} />
            <span className="text-sm">PPT</span>
          </Button>
          
          <Button
            onClick={onAddQuiz}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 h-12 gap-2"
            variant="outline"
          >
            <MdOutlineQuiz size={18} />
            <span className="text-sm">Quiz</span>
          </Button>
        </div>
      </div>

      {/* Drag Zone Hint */}
      <div className="bg-black/20 mx-4 mb-4 rounded-lg border-2 border-dashed border-white/30 py-3 text-center">
        <p className="text-sm text-white/70">
          Drag files here or use buttons above
        </p>
      </div>
    </header>
  );
}
