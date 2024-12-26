import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  HelpCircle,
  Settings,
  User,
  Bell,
  Menu,
  PlusIcon,
  HelpCircleIcon,
  Save,
  Send,
  Trash2 // Add this import
} from "lucide-react";

// Custom SVG Icon Component
const Icon = ({ type }) => {
  const iconStyles = "w-6 h-6 text-primaryTwo";

  switch (type) {
    case "video":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconStyles}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    case "document":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconStyles}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "quiz":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconStyles}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      );
    case "text":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconStyles}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const SideNavItem = ({ icon: IconComponent, label, isExpanded }) => (
  <div className="group flex items-center p-4 hover:bg-gray-200 cursor-pointer transition-all duration-300">
    <IconComponent className="w-6 h-6 text-primaryTwo" />
    <span
      className={`ml-4 text-primaryTwo whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}
    >
      {label}
    </span>
  </div>
);

const CourseCreationWorkflow = () => {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction to the Course",
      content: []
    }
  ]);

  const [activeSection, setActiveSection] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSections, setShowMobileSections] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const contentTypes = [
    {
      icon: "video",
      label: "Video Lecture",
      type: "video"
    },
    {
      icon: "document",
      label: "Resource Document",
      type: "document"
    },
    {
      icon: "quiz",
      label: "Quiz",
      type: "quiz"
    },
    {
      icon: "text",
      label: "Text Lesson",
      type: "text"
    }
  ];

  const renderTopNav = () => (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <Menu
          className="w-6 h-6 text-primaryTwo mr-4 cursor-pointer"
          onClick={() => {
            setIsSideNavExpanded(!isSideNavExpanded);
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        />
        <Link to="/" className="block text-xl font-bold text-primaryTwo">PPTLINKS</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
          <Save className="w-4 h-4 mr-2 hidden sm:block" />
          <span className="hidden sm:block">Save Draft</span>
          <Save className="w-4 h-4 sm:hidden" />
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
          <Send className="w-4 h-4 mr-2 hidden sm:block" />
          <span className="hidden sm:block">Submit</span>
          <Send className="w-4 h-4 sm:hidden" />
        </button>
      </div>
    </div>
  );

  const renderSideNav = () => (
    <div
      className={`bg-white border-r transition-all duration-300 flex flex-col fixed sm:relative z-50 h-full
        ${isSideNavExpanded ? "w-48" : "w-16"} 
        ${isMobileMenuOpen ? "block" : "hidden sm:block"}`}
      onMouseEnter={() => setIsSideNavExpanded(true)}
      onMouseLeave={() => setIsSideNavExpanded(false)}
    >
      <SideNavItem
        icon={BookOpen}
        label="Courses"
        isExpanded={isSideNavExpanded}
      />
      <SideNavItem
        icon={HelpCircle}
        label="Feedback & Help"
        isExpanded={isSideNavExpanded}
      />
      <SideNavItem
        icon={Settings}
        label="Settings"
        isExpanded={isSideNavExpanded}
      />
      <SideNavItem icon={User} label="Profile" isExpanded={isSideNavExpanded} />
      <SideNavItem
        icon={Bell}
        label="Notifications"
        isExpanded={isSideNavExpanded}
      />
    </div>
  );

  const renderContextualHelp = () => (
    <div className="absolute right-4 top-4 z-10">
      <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition">
        <HelpCircleIcon className="w-6 h-6" />
      </button>
      {activeSection && (
        <div className="absolute right-full mr-2 bg-white shadow-lg rounded-lg p-4 w-64">
          <h3 className="font-bold mb-2">Tip: Adding Content</h3>
          <p className="text-sm text-primaryTwo">
            Drag and drop content blocks or use the + button to add new content
            to your section. Each block represents a different type of learning
            material.
          </p>
        </div>
      )}
    </div>
  );

  const renderSectionManager = () => (
    <div
      className={`w-full sm:w-1/4 bg-gray-100 p-4 border-r overflow-y-auto 
      ${showMobileSections ? "block" : "hidden sm:block"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Course Sections</h2>
        <button
          className="sm:hidden"
          onClick={() => setShowMobileSections(false)}
        >
          ×
        </button>
      </div>
      {sections.map((section) => (
        <div
          key={section.id}
          className={`p-2 mb-2 rounded cursor-pointer flex justify-between items-center ${
            activeSection?.id === section.id
              ? "bg-blue-100 border-blue-500 border"
              : "hover:bg-gray-200"
          }`}
        >
          <div onClick={() => setActiveSection(section)}>{section.title}</div>
          {sections.length > 1 && (
            <button
              className="text-red-500 hover:text-red-700 p-1"
              onClick={(e) => {
                e.stopPropagation();
                const updatedSections = sections.filter(
                  (s) => s.id !== section.id
                );
                setSections(updatedSections);
                if (activeSection?.id === section.id) {
                  setActiveSection(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center bg-primaryTwo"
        onClick={() => {
          const newSection = {
            id: sections.length + 1,
            title: `Section ${sections.length + 1}`,
            content: []
          };
          setSections([...sections, newSection]);
        }}
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Section
      </button>
    </div>
  );

  const renderContentBuilder = () => (
    <div
      className={`w-full sm:w-1/2 p-4 relative bg-primaryTwo
      ${!showMobileSections && !showMobilePreview ? "block" : "hidden sm:block"}`}
    >
      {activeSection ? (
        <>
          <div className="flex justify-between items-center mb-4 bg-primaryTwo">
            <input
              type="text"
              value={activeSection.title}
              className="text-2xl text-white font-bold w-full border-b pb-2 bg-transparent"
              onChange={(e) => {
                const updatedSections = sections.map((section) =>
                  section.id === activeSection.id
                    ? { ...section, title: e.target.value }
                    : section
                );
                setSections(updatedSections);
              }}
            />
          </div>

          <div className="flex space-x-2 mb-4">
            {contentTypes.map((type) => (
              <button
                key={type.type}
                className="flex items-center bg-gray-200 p-2 rounded hover:bg-gray-300"
                onClick={() => {
                  // Logic to add content block
                }}
              >
                <Icon type={type.icon} />
                <span className="ml-2">{type.label}</span>
              </button>
            ))}
          </div>

          <div className="border-2 border-dashed min-h-[300px] p-4 bg-gray-50 rounded">
            {activeSection.content.length === 0 && (
              <div className="text-center text-primaryTwo">
                Drag content blocks here or use the buttons above
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-primaryTwo">
          Select a section to start editing
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div
      className={`w-full sm:w-1/4 bg-white p-4 border-l overflow-y-auto
      ${showMobilePreview ? "block" : "hidden sm:block"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Preview</h2>
        <button
          className="sm:hidden"
          onClick={() => setShowMobilePreview(false)}
        >
          ×
        </button>
      </div>
      {previewMode ? (
        <div>
          <div className="bg-gray-100 p-4 rounded">Course preview content</div>
        </div>
      ) : (
        <div>
          <h3 className="font-bold mb-2">Section Overview</h3>
          {activeSection ? (
            <div className="bg-gray-100 p-2 rounded">
              <p>Total Content Blocks: {activeSection.content.length}</p>
              <p>Estimated Section Duration: Not calculated</p>
            </div>
          ) : (
            <p className="text-primaryTwo">Select a section to see details</p>
          )}
        </div>
      )}
    </div>
  );

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 sm:hidden">
      <button className="p-2" onClick={() => setShowMobileSections(true)}>
        Sections
      </button>
      <button className="p-2" onClick={() => setShowMobilePreview(true)}>
        Preview
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {renderTopNav()}
      <div className="flex flex-1 overflow-hidden relative">
        {renderSideNav()}
        <div className="flex flex-1 flex-col sm:flex-row w-full overflow-auto">
          {renderSectionManager()}
          {renderContentBuilder()}
          {renderPreview()}
        </div>
      </div>
      {renderMobileNav()}
    </div>
  );
};

export default CourseCreationWorkflow;
