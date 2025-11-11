import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import CourseOverviewRoot from "./courseOverviewRoot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoPersonCircle } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import settings_svg from "/settings.svg";
import { IoImages } from "react-icons/io5";
import { AiOutlineSend } from "react-icons/ai";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import kola from "/team/kola.jpg";

const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);
const messagesTypeArray = ["All Messages", "Students", "Tutors"];
export default function CourseOverviewMessages() {
  const { bg, text, border } = useTheme();
  const [view, setView] = useState({
    listOfAllStudents: true,
    studentTutorChats: false,
    listOfCourseMessages: false,
    courseMessage: false
  });
  const [messageView, setMessageView] = useState({
    view: false,
    value: messagesTypeArray[0]
  });

  const handleMessageView = (
    currentView: string,
    isSet: boolean = true
  ): string => {
    setMessageView((prev) => ({
      ...prev,
      view: !isSet ? false : !prev.view,
      value: currentView
    }));
    setView({
      listOfAllStudents: !isSet ? false : true,
      studentTutorChats: false,
      listOfCourseMessages: !isSet ? true : false,
      courseMessage: false
    });

    return currentView;
  };

  return (
    <CourseOverviewRoot>
      <ScrollArea
        className={`wrapper w-full grid grid-rows-[auto_1fr] grid-cols-1 gap-2 overflow-hidden [&_*::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: "calc(100vh-144px)"
        }}
      >
        {/* header section */}
        <header
          className={`w-fit h-fit mb-4 flex justify-start items-center gap-4 z-10`}
        >
          <div className="relative w-fit h-fit">
            <button
              type="button"
              onClick={() =>
                setMessageView((prev) => ({ ...prev, view: !prev.view }))
              }
              className={`flex items-center justify-start gap-4 h-10 px-2 ${bg} ${text} text-sm ${border} border-[0.1px] rounded-md cursor-pointer`}
            >
              <img src={settings_svg} alt={settings_svg} />
              <span>{messageView.value}</span>
              <span>
                <FaAngleDown />
              </span>
            </button>

            {/* Hidden dropdown - remove or fix display */}
            <div
              className={`${!messageView.view ? "hidden" : "flex absolute z-10 top-[2.7rem] left-0"} flex-col justify-start items-center gap-[1px] w-full h-fit ${bg} ${text} text-sm ${border} border-[0.1px] p-[0.1rem] rounded-md cursor-pointer`}
            >
              {/* dropdown content */}
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[0])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[0] && "!bg-[#FFFFF0] !text-black"}`}
              >
                All Messages
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[1])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[1] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Students
              </button>
              <button
                type="button"
                title="set message view"
                onClick={() => handleMessageView(messagesTypeArray[2])}
                className={`w-full h-full ${text} text-sm text-left border-[0.1px] border-gray-600/65 rounded-md outline-none py-2 px-2 ${messageView.value === messagesTypeArray[2] && "!bg-[#FFFFF0] !text-black"}`}
              >
                Tutors
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleMessageView(messageView.value, false)}
            className={`flex items-center justify-center h-10 px-6 bg-[#FFFFF0] text-black text-sm border-none rounded-md cursor-pointer`}
          >
            Course Messages
          </button>
        </header>
        {/* all messages, students, tutors... area/section */}
        <div className="w-full h-full relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white">
          <ScrollArea
            className={`scrollbar-hide block w-full ${view.studentTutorChats ? "md:!h-[420px]" : "md:!h-[410px]"}`}
          >
            {/* list of all students */}
            {view.listOfAllStudents && (
              <ul className="w-full h-fit">
                {ViewStudents.map((students) => (
                  <li
                    key={students.toString()}
                    className="w-full h-fit !border-b-[0.1px] border-[#8080808e]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setView({
                          listOfAllStudents: false,
                          studentTutorChats: true,
                          listOfCourseMessages: false,
                          courseMessage: false
                        })
                      }
                      className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center items-center py-4 px-3"
                    >
                      <span className="flex justify-start items-center gap-2 w-full h-fit text-sm text-ellipsis">
                        <span>Raymond{students} A. Amem</span>
                        <span className="block w-fit h-fit px-1 py-0.5 border-none rounded-md bg-gray-400 text-black text-xs">
                          Tutor
                        </span>
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-sm text-ellipsis">
                        I will be absent in the next two classes be...
                      </span>
                      <span className="inline-flex justify-end items-center gap-1 w-full h-fit text-sm">
                        <span className="block w-2 h-2 border-none rounded-full bg-primarySixTwo"></span>
                        <span className=""></span>
                        <span>14 May</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* a tutor student chat */}
            {view.studentTutorChats && (
              <>
                <header className="w-full h-fit py-1 px-2 flex justify-start items-center gap-2 border-b-[0.1px] border-[#8080808e]">
                  <span className="w-fit aspect-square">
                    <IoPersonCircle size={38} />
                  </span>
                  <span className="text-sm font-semibold">Raymond Amem</span>
                </header>
                {/* chat messages */}
                <div className="messageBox w-full min-h-[20rem] p-2 flex flex-col justify-center">
                  {Array.from({ length: 8 }, (_, index) => (
                    <>
                      <span
                        key={`chat-date-${index}`}
                        className={`${index === 0 || index === 4 || index === 6 ? "block" : "hidden"} w-fit text-sm mx-auto my-4`}
                      >
                        July 20
                      </span>
                      <div
                        key={`message-${index}`}
                        className={`w-[53%] h-fit p-4 flex flex-col justify-start items-center mb-2 border-none rounded-sm ${bg} ${text} ${
                          index % 2 === 0
                            ? "!self-end"
                            : "!self-start !bg-slate-200 !text-black"
                        } ${index > 5 && "!hidden"}`}
                      >
                        <p className="block w-full text-sm text-wrap mb-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Nemo, asperiores ab! Vel vero adipisci voluptate
                          ipsam nobis beatae at aliquid rem eum repellendus, ut
                          magnam enim, ipsum, in id sunt.
                        </p>
                        <span className="block w-full text-sm text-wrap text-right">
                          12:45 am
                        </span>
                      </div>
                      {/* Images */}
                      <div
                        key={`message-${index}`}
                        className={`w-[53%] h-fit p-4 flex-col justify-start items-center mb-2 border-none rounded-sm hidden ${
                          index % 2 === 0 ? "!self-end" : "!self-start"
                        } ${index > 5 && "!flex"}`}
                      >
                        <img
                          src={kola}
                          alt={kola}
                          className="block w-4/6 aspect-square object-cover border-none rounded-sm"
                        />
                        <span className="block w-4/6 pt-4 mx-auto text-sm text-wrap text-right text-white">
                          12:45 am
                        </span>
                      </div>
                    </>
                  ))}
                </div>
                {/* chat img-picker & input */}
                <div className="border-none w-full h-full grid grid-cols-[34px_1fr_34px] grid-rows-[40px] gap-2 justify-evenly items-center px-2 mb-2">
                  <label
                    htmlFor="filePicker"
                    className="flex justify-center items-center w-full aspect-square bg-[red]_ border-none rounded-sm relative cursor-pointer"
                  >
                    <input
                      type="file"
                      name="filePicker"
                      id="filePicker"
                      className="absolute -top-1 -left-1 w-0 h-0 opacity-0"
                      accept="*"
                    />
                    <IoImages size={24} className="w-full h-full" />
                  </label>
                  <span className="block w-[80%]_ w-full h-full relative py-[2.5px] border-[1px] rounded-sm border-gray-300">
                    <input
                      type="text"
                      className="block w-full h-full border-none rounded-sm py-1.5 indent-2 bg-black text-white text-sm"
                      placeholder="Type a message..."
                    />
                  </span>
                  <button
                    type="button"
                    title="send message"
                    className="text-white block w-fit h-full border-none rounded-sm p-1"
                  >
                    <AiOutlineSend size={20} />
                  </button>
                </div>
              </>
            )}
            {/* course message list */}
            {view.listOfCourseMessages && (
              <ul className="w-full h-fit">
                {ViewStudents.map((students) => (
                  <li
                    key={students.toString()}
                    className="w-full h-fit !border-b-[0.1px] border-[#8080808e]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setView({
                          listOfAllStudents: false,
                          studentTutorChats: false,
                          listOfCourseMessages: false,
                          courseMessage: true
                        })
                      }
                      className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center items-center py-4 px-3"
                    >
                      <span className="flex justify-start items-center gap-2 w-full h-fit text-sm text-ellipsis">
                        <span>
                          Python 0{students}{" "}
                          {students <= 10 ? "Beginner" : "Advance"}
                        </span>
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-sm text-ellipsis">
                        We have reschedule our next python...
                      </span>
                      <span className="inline-flex justify-end items-center gap-1 w-full h-fit text-sm">
                        <span>14 May</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* a course message */}
            {view.courseMessage && (
              <>
                <header className="w-full h-fit py-2 px-2 flex justify-start items-center gap-2">
                  <span className="text-sm font-semibold">
                    To. Python 001 (Beginner)
                  </span>
                </header>
                {/* chat messages */}
                <div className="messageBox w-full min-h-[20rem] p-2 flex flex-col justify-center">
                  {Array.from({ length: 8 }, (_, index) => (
                    <>
                      <span
                        key={`chat-date-${index}`}
                        className={`${index === 0 || index === 4 || index === 6 ? "block" : "hidden"} w-fit text-sm mx-auto my-4`}
                      >
                        {index + 1} July 2025
                      </span>
                      <div
                        key={`message-${index}`}
                        className={`w-full h-fit p-4 flex flex-col justify-start items-center mb-2 border-none rounded-sm ${bg} ${text} ${index > 5 && "!hidden"}`}
                      >
                        <p className="block w-full text-sm text-wrap mb-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Quis atque voluptatum ut molestiae facilis
                          praesentium. Modi sit quae ex, ipsam impedit suscipit
                          possimus fuga, cum facilis nisi, magni recusandae
                          commodi maxime sapiente eligendi. Labore dolorem
                          inventore iure cumque quae ipsam, animi, neque
                          eveniet, quos a nisi laudantium dignissimos voluptate
                          sapiente vero aspernatur non voluptatum minima quidem
                          nam. Adipisci suscipit fugit libero odit magni
                          pariatur vitae magnam recusandae labore, aperiam odio!
                        </p>
                        <p className="block w-full text-sm text-wrap py-2">
                          Best regards
                        </p>
                        <span className="block w-full text-sm text-wrap text-right">
                          12:45 am
                        </span>
                      </div>
                      {/* Images */}
                      <div
                        key={`message-${index}`}
                        className={`w-full h-fit p-4 flex-col justify-start items-center mb-2 border-none rounded-sm hidden ${
                          index % 2 === 0 ? "!self-end" : "!self-start"
                        } ${index > 5 && "!flex"}`}
                      >
                        <img
                          src={kola}
                          alt={kola}
                          className="block w-4/6 aspect-square object-cover border-none rounded-sm"
                        />
                        <span className="block w-4/6 pt-4 mx-auto text-sm text-wrap text-right text-white">
                          12:45 am
                        </span>
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </ScrollArea>
        </div>
        {/* back btn */}
        {(view.studentTutorChats || view.courseMessage) && (
          <button
            type="button"
            onClick={() =>
              setView({
                listOfAllStudents: view.courseMessage ? false : true,
                studentTutorChats: false,
                listOfCourseMessages: view.courseMessage ? true : false,
                courseMessage: false
              })
            }
            className="flex justify-center items-center mt-6 w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
          >
            Back
          </button>
        )}
      </ScrollArea>
    </CourseOverviewRoot>
  );
}

<!-- /////////////////////////////////////////////////////////////// -->

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import CourseOverviewRoot from "./courseOverviewRoot";
import { CiSearch } from "react-icons/ci";
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";
import { ScrollArea } from "@/components/ui/scroll-area";
import close_svg from "/Vector_close.svg";
import open_svg from "/Vector_open.svg";

const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);

export default function CourseOverviewStudents() {
  const [currentView, setCurrentView] = useState(1);
  const [search, setSearch] = useState("");
  const { search: globalSearch } = useContext(UtilityProvider);
  const { bg, text, border } = useTheme();

  return (
    <CourseOverviewRoot>
      <ScrollArea
        className={`wrapper w-full ${currentView !== 1  && "px-4"} grid grid-rows-[auto_1fr] grid-cols-1 gap-2 overflow-hidden [&_*::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: "calc(100vh-144px)"
        }}
      >
        {currentView === 1 && (
          <>
            {/* search */}
            <div
              className={`w-[60%] mx-auto h-fit rounded-[.5rem] border ${border} _border-white ${search !== "" && "!border-[#FFA500]"} relative mb-5 ${globalSearch.isMobileSearch ? "maxScreenMobile:hidden" : ""}`}
            >
              <input
                type="text"
                name="searcher"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for Libraries"
                className={`block w-full min-h-[1rem] text-[.8rem] indent-4 p-2 rounded-[.5rem] ${bg} ${text}`}
              />
              <span
                className={`block w-fit ${text} text-[#FFFFF0] ${currentView == 3 && "text-primaryTwo"} text-[1.3rem]  absolute right-2 top-[50%] translate-y-[-50%] pointer-events-none`}
              >
                <CiSearch />
              </span>
            </div>

            <div className="w-full h-full  _bg-gray-700 relative grid grid-rows-[auto_1fr] grid-cols-1 px-4 rounded-sm !border-[0.1px] border-white">
              <header className="w-full h-fit grid grid-cols-6 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Name
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Course
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Joined
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Progress
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Status
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Action
                </span>
              </header>
              <ScrollArea className="scrollbar-hide block w-full !h-[380px]">
                <ul className="w-full h-fit">
                  {ViewStudents.map((students) => (
                    <li
                      key={students.toString()}
                      className="w-full h-fit grid grid-cols-6 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
                    >
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        Raymond{students} A. Amem
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        Python 00{students}
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        May 1{students}, 2025
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        {students}0%
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
                        {students % 2 ? "Active" : "Completed"}
                      </span>
                      <span className="flex justify-center items-center w-full h-fit py-2">
                        <Link
                          to={"#"}
                          onClick={() => setCurrentView(2)}
                          className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                        >
                          View
                        </Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </>
        )}
        {currentView === 2 && (
          <>
            <div className={`w-full min-h-full py-4`}>
              <ul className="block w-full h-fit">
                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Email:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    raymondamem525@gmail.com
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Name:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    Raymond Amem A.
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Account Status:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    Active
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Course Enrolled:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    Python 001
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
                  <span className="block w-full h-fit font-semibold text-sm text-white">
                    Attendance Rate:{" "}
                  </span>
                  <span className="block w-full h-fit text-sm text-[gray]">
                    12 of 20 Students (68%)
                  </span>
                </li>
              </ul>
              <div className="w-fit flex gap-8 justify-between items-center pt-4">
                <Link
                  to={"#"}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  Remove from course
                </Link>
                <Link
                  to={"#"}
                  className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
                >
                  Send message
                </Link>
              </div>
            </div>
            <p className="text-primarySixTwo text-sm font-semibold mb-2">
              Sessions Attended
            </p>
            <div className="w-full mx-auto h-full relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white">
              <header className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Session
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Date
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Duration
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Status
                </span>
              </header>
              <ScrollArea className="scrollbar-hide block w-full !h-[300px]">
                <ul className="w-full h-fit">
                  {ViewStudents.map((students) => (
                    <li
                      key={students.toString()}
                      className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
                    >
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        Python 00{students}
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        May 1{students}, 2025
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        {students % 2 ? `${students}0 Minutes` : `-`}
                      </span>
                      <span className="flex justify-center items-center gap-1 w-full h-fit text-xs text-ellipsis">
                        {students % 2 ? (
                          <>
                            <img
                              src={`${open_svg}`}
                              alt="Present"
                              className="w-3 h-3"
                            />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={`${close_svg}`}
                              alt="Absent"
                              className="w-3 h-3"
                            />
                            <span>Absent</span>
                          </>
                        )}
                      </span>
                      {/* <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        {students % 2 ? (
                          <MdOutlineCoPresent size={20} />
                        ) : (
                          <MdOutlineSmsFailed size={20} />
                        )}
                      </span> */}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <p className="text-primarySixTwo text-sm font-semibold mb-2 pt-4">
              Quiz Results
            </p>
            <div className="w-full mx-auto h-full relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white">
              <header className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Quiz title
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Score
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Quetions
                </span>
                <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
                  Date taken
                </span>
              </header>
              <ScrollArea className="scrollbar-hide block w-full !h-[300px]">
                <ul className="block w-full h-fit">
                  {ViewStudents.map((students) => (
                    <li
                      key={students.toString()}
                      className="w-full h-fit grid grid-cols-4 grid-rows-1 justify-center items-center py-1 !border-b-[0.1px] border-[#8080808e]"
                    >
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        Week 00{students} quiz
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        {students}/20
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        {students}
                      </span>
                      <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis py-2">
                        {students} Jul 2025
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="w-fit flex gap-8 justify-between items-center mt-2">
              <Link
                to={"#"}
                onClick={() => setCurrentView(1)}
                className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
              >
                Back
              </Link>
            </div>
          </>
        )}
      </ScrollArea>
    </CourseOverviewRoot>
  );
}



<!-- ////////////////////////////////////////////////tailwinf.config.mjs////////////////////////////////// -->
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/*", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onxy: "#181818",
        brightWhite: "#fbfbfb",
        faintblack: "rgba(255, 255, 255, 0.5)",
        blur: "hsl(0 0% 100% / .05)",
        black101: "rgba(21, 21, 21, 0.5)",
        white25: "rgba(255, 255, 255, 0.5)",
        white10: "rgba(255, 255, 255, 0.1)",
        white70: "rgba(255, 255, 255, 0.7)",
        blue: "rgba(63, 100, 233, 0.43)",
        red: "rgba(233, 63, 63, 0.43)",
        golden: "hsla(43, 100%, 50%, 0.43)",
        dimeblack: "#0d0d0d",
        darkGray: "#808080",
        mediumGray: "rgba(128, 128, 128, 0.5)",
        lightGray: "#c5c5c5",
        borderDark: "#383737",
        lightBorder: "#ebebeb",
        body: "#FFFFF0",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        },
        // primaryTwo: '#212A37',
        primaryTwo: {
          DEFAULT: "#191919",
          dark: "#191919", // Dark mode value
          light: "#FFFFF0" // Light mode value (primaryThree)
        },
        primaryThree: "#FFFFF0",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      boxShadow: {
        altShadow: "0px 0px 15px rgba(255,166,0,0.53)"
      },
      utilities: {
        baseSpace: "mt-5",
        baseFont: "sm",
        lineHeight: "leading-6",
        keyframes: {
          ping: {
            "75%, 100%": {
              content: "",
              transform: "scale(1)",
              opacity: "0"
            }
          },
          pinging: {
            "0%": {
              transform: "scale(1)",
              opacity: "1"
            },
            "50%": {
              transform: "scale(1.2)",
              opacity: "0.6"
            },
            "100%": {
              transform: "scale(1.5)",
              opacity: "0"
            }
          }
        },
        animation: {
          "ping-200": "ping 1s 200ms cubic-bezier(0, 0, 0.2, 1) infinite",
          pinging: "pinging 1s infinite"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0"
          },
          to: {
            height: "var(--radix-accordion-content-height)"
          }
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)"
          },
          to: {
            height: "0"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      tall: {
        min: "2000px"
      },
      maxScreen: {
        max: "1050px"
      },
      maxScreenMobile: {
        max: "768px"
      },
      maxSmallMobile: {
        max: "468px"
      }
    },
    plugins: []
  },
  plugins: [require("tailwindcss-animate")]
};


<!-- ///////////////////////////////////////////////////////////////// -->
import { useState } from "react"
import { Settings, Bell } from "lucide-react"

export default function CourseDashboardOverviewPage() {
  const [activeNav, setActiveNav] = useState("Dashboard")

  const navItems = [
    "Dashboard",
    "Presentations",
    "My Courses",
    "Live Sessions",
    "Students",
    "Messages",
    "Earnings",
    "Settings",
  ]

  return (
    <section className="h-screen w-full bg-gray-900 text-white grid grid-cols-1 grid-rows-[auto_1fr]">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-400">PPTLinks</h1>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5" />
            <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="h-full grid grid-cols-[300px_1fr] grid-rows-1">
        <div className="aside h-full border-r-2 border-r-gray-700 grid grid-cols-1 grid-rows-[auto_1fr_auto] p-4">
          <h3 className="w-full min-h-24 font-semibold text-2xl text-white mb-6">Welcome Back, Raymond</h3>

          <nav className="w-full h-full flex flex-col justify-start items-start gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`block w-full h-fit p-3 text-left border-none rounded-lg transition-colors ${
                  activeNav === item ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button className="text-gray-400 hover:text-white transition-colors">Log Out</button>
        </div>

        <main className="w-full h-full bg-gray-100 grid grid-cols-1 grid-rows-[100px_1fr]">
          <div className="main-header flex flex-col gap-2 p-4 bg-gray-800 text-white">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Hi, Raymond Aondoakura!</h2>
              <button className="text-2xl text-gray-300 hover:text-white">
                <Settings />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <p className="text-sm text-gray-300">You have 2 new notifications.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Upload Slides
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  Schedule Live Session
                </button>
                <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                  Create New Course
                </button>
              </div>
            </div>
          </div>

          <div className="wrapper w-full h-full grid grid-cols-1 grid-rows-[1fr_1fr] p-4 gap-0.5 px-0.5 py-0.5">
            <div className="analyticsOverview grid grid-cols-3 grid-rows-1 w-full h-full gap-0.5">
              <div className="w-full h-full bg-green-500 p-4 rounded-lg text-white flex flex-col justify-between hover:bg-green-600 transition-colors">
                <h3 className="text-lg font-semibold">Upcoming Classes</h3>
                <div>
                  <p className="text-sm opacity-90">Python 002</p>
                  <p className="text-xs opacity-75">October 1, 10:00 AM</p>
                  <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm mt-2 hover:bg-orange-600 transition-colors">
                    Start Session
                  </button>
                </div>
              </div>
              <div className="w-full h-full bg-purple-500 p-4 rounded-lg text-white flex flex-col justify-between hover:bg-purple-600 transition-colors">
                <h3 className="text-lg font-semibold">Total Enrolled Students</h3>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">120</p>
                  <button className="text-orange-300 underline hover:text-orange-200 transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="w-full h-full bg-red-500 p-4 rounded-lg text-white flex flex-col justify-between hover:bg-red-600 transition-colors">
                <h3 className="text-lg font-semibold">Active Courses</h3>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">6</p>
                  <button className="text-orange-300 underline hover:text-orange-200 transition-colors">
                    Create New Course
                  </button>
                </div>
              </div>
            </div>

            <div className="analyticsOverviewBottom w-full h-full grid grid-cols-[400px_1fr] grid-rows-1 gap-0.5">
              <div className="w-full h-full bg-yellow-500 p-4 rounded-lg text-white hover:bg-yellow-600 transition-colors">
                <h3 className="text-lg font-semibold mb-4">Earnings</h3>
                
              </div>
              <div className="w-full h-full bg-teal-500 p-4 rounded-lg text-white hover:bg-teal-600 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Messages</h3>
                  <span className="text-teal-200 text-sm">Latest Messages</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="bg-teal-600 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">Joh Doe</p>
                      <span className="text-xs opacity-75">20 Jul</span>
                    </div>
                    <p className="text-xs opacity-90">I'm having trouble logging in...</p>
                  </div>
                  <div className="bg-teal-600 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">Jane Doe</p>
                      <span className="text-xs opacity-75">14 Jul</span>
                    </div>
                    <p className="text-xs opacity-90">I will be absent in the next two classes...</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">2</p>
                  <button className="text-orange-300 underline hover:text-orange-200 transition-colors">
                    Send Course Mail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}


    // <CourseOverviewRoot>
    //   {currentView === 1 && !scheduleSession && (
    //     <div className="wrapper w-full h-full grid grid-cols-1 grid-rows-[1fr_1fr] gap-2">
    //       <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
    //         <p className="text-white text-sm font-semibold">
    //           Upcoming Sessions
    //         </p>
    //         <div
    //           className={`analyticsOverview ${"grid grid-cols-[1fr_1.5fr] grid-rows-1 gap-2"} w-full h-full`}
    //         >
    //           <Link
    //             to={"#"}
    //             onClick={() => setCurrentView(2)}
    //             className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
    //           >
    //             <div className="flex justify-between items-center">
    //               <h3 className="text-2xl font-semibold">Python 001</h3>
    //               <Link
    //                 to={"#"}
    //                 onClick={() => setCurrentView(2)}
    //                 className="underline text-sm mt-2 text-orange-600 transition-colors"
    //               >
    //                 Reschedule
    //               </Link>
    //             </div>
    //             <div className="w-full flex flex-col">
    //               <p className="text-xl opacity-90">
    //                 <span>Co-host: {"Raymond A. Amem"}</span>
    //               </p>
    //               <div className="w-full flex items-center justify-between">
    //                 <p className="text-sm opacity-90">
    //                   <span className="text-xs opacity-75">
    //                     October 1, 10:00 AM
    //                   </span>
    //                 </p>
    //                 <Link
    //                   to={"#"}
    //                   onClick={() => setCurrentView(2)}
    //                   className="underline text-sm mt-2 text-orange-600 transition-colors"
    //                 >
    //                   Start session
    //                 </Link>
    //               </div>
    //             </div>
    //           </Link>
    //           <div
    //             className={`w-full h-full ${UpcomingSessions && UpcomingSessions.length > 0 ? "grid grid-cols-2 grid-rows-2 gap-2" : "flex justify-center items-center"}`}
    //           >
    //             {UpcomingSessions && UpcomingSessions.length > 0 ? (
    //               UpcomingSessions.map((index) => (
    //                 <Link
    //                   key={index.toString()}
    //                   to={"#"}
    //                   onClick={() => setCurrentView(2)}
    //                   className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
    //                 >
    //                   <h3 className="text-lg font-semibold">
    //                     Python 00{index}
    //                   </h3>
    //                   <div className="w-full flex flex-col">
    //                     <p className="text-md opacity-90">
    //                       <span>Co-host: Raymond{index} A. Amem</span>
    //                     </p>
    //                     <div className="w-full flex items-center justify-between">
    //                       <p className="text-sm opacity-90">
    //                         <span className="text-xs opacity-75">
    //                           October {index}, 10:00 AM
    //                         </span>
    //                       </p>
    //                       <Link
    //                         to={"#"}
    //                         onClick={() => setCurrentView(2)}
    //                         className="underline text-sm mt-2 text-orange-600 transition-colors"
    //                       >
    //                         Reschedule
    //                       </Link>
    //                     </div>
    //                   </div>
    //                 </Link>
    //               ))
    //             ) : (
    //               <div className="w-full h-full flex justify-center items-center">
    //                 <p className="text-sm text-orange-600">
    //                   No more upcoming sessions available
    //                 </p>
    //               </div>
    //             )}

    //             {/* View More always at the end */}
    //             {UpcomingSessions && UpcomingSessions.length > 0 && (
    //               <Link
    //                 to={"#"}
    //                 onClick={() => setCurrentView(2)}
    //                 className="w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
    //               >
    //                 View more
    //               </Link>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
    //         <p className="text-white text-sm font-semibold">
    //           Previous Sessions
    //         </p>
    //         <div
    //           className={`w-full h-full ${PreviousSessions && PreviousSessions.length > 0 ? "grid grid-cols-4 grid-rows-2 gap-2" : "flex justify-center items-center"}`}
    //         >
    //           {PreviousSessions && PreviousSessions.length > 0 ? (
    //             PreviousSessions.map((index) => (
    //               <Link
    //                 key={index.toString()}
    //                 to={"#"}
    //                 onClick={() => setCurrentView(2)}
    //                 className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between"
    //               >
    //                 <h3 className="text-lg font-semibold">Python 00{index}</h3>
    //                 <div className="w-full flex flex-col">
    //                   <p className="text-md opacity-90">
    //                     <span>Co-host: Raymond{index} A. Amem</span>
    //                   </p>
    //                   <div className="w-full flex items-center justify-between">
    //                     <p className="text-sm opacity-90">
    //                       <span className="text-xs opacity-75">
    //                         October {index}, 10:00 AM
    //                       </span>
    //                     </p>
    //                     <Link
    //                       to={"#"}
    //                       onClick={() => setCurrentView(2)}
    //                       className="underline text-sm mt-2 text-orange-600 transition-colors"
    //                     >
    //                       Reschedule
    //                     </Link>
    //                   </div>
    //                 </div>
    //               </Link>
    //             ))
    //           ) : (
    //             <div className="w-full h-full flex justify-center items-center">
    //               <p className="text-sm text-orange-600">
    //                 No previous sessions available
    //               </p>
    //             </div>
    //           )}

    //           {/* View More always at the end */}
    //           {PreviousSessions && PreviousSessions.length > 0 && (
    //             <Link
    //               to={"#"}
    //               onClick={() => setCurrentView(2)}
    //               className={
    //                 "w-full h-full border-none rounded-sm flex justify-center items-center text-orange-600 font-semibold text-sm underline transition-colors"
    //               }
    //             >
    //               View more
    //             </Link>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   {currentView === 2 && !scheduleSession && (
    //     <div className="wrapper w-full h-fit grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
    //       <button
    //         onClick={() => setCurrentView(1)}
    //         className="block w-fit text-white text-sm font-semibold"
    //       >
    //         Previous Sessions
    //       </button>
    //       <div
    //         className={`w-full min-h-full px-4 !border-[0.1px] border-white py-4`}
    //       >
    //         <ul className="block w-full h-fit">
    //           <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
    //             <span className="block w-full h-fit font-semibold text-sm text-white">
    //               Title:{" "}
    //             </span>
    //             <span className="block w-full h-fit text-sm text-[gray]">
    //               Python 001
    //             </span>
    //           </li>

    //           <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
    //             <span className="block w-full h-fit font-semibold text-sm text-white">
    //               Date & Time:{" "}
    //             </span>
    //             <span className="block w-full h-fit text-sm text-[gray]">
    //               October 1, 10:47AM-11:47AM
    //             </span>
    //           </li>

    //           <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
    //             <span className="block w-full h-fit font-semibold text-sm text-white">
    //               Duration:{" "}
    //             </span>
    //             <span className="block w-full h-fit text-sm text-[gray]">
    //               100Min
    //             </span>
    //           </li>

    //           <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
    //             <span className="block w-full h-fit font-semibold text-sm text-white">
    //               Co-host:{" "}
    //             </span>
    //             <span className="block w-full h-fit text-sm text-[gray]">
    //               Raymond A. AMem
    //             </span>
    //           </li>

    //           <li className="grid grid-cols-[1fr_2fr] gap-1 mb-4">
    //             <span className="block w-full h-fit font-semibold text-sm text-white">
    //               Attendance Rate:{" "}
    //             </span>
    //             <span className="block w-full h-fit text-sm text-[gray]">
    //               12 of 20 Students (68%)
    //             </span>
    //           </li>
    //         </ul>

    //         <div className="flex justify-between items-center pt-16">
    //           <Link
    //             to={"#"}
    //             onClick={() => setCurrentView(1)}
    //             className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
    //           >
    //             Back
    //           </Link>
    //           <Link
    //             to={"#"}
    //             onClick={() => setCurrentView(3)}
    //             className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
    //           >
    //             View Attendance
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   {currentView === 3 && !scheduleSession && (
    //     <div className="wrapper w-full h-fit grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
    //       <div className="w-full h-fit">
    //         <div className="w-full flex items-center gap-8 mb-6">
    //           <button
    //             onClick={() => setCurrentView(2)}
    //             className="text-white text-sm font-semibold"
    //           >
    //             Previous Sessions
    //           </button>
    //           <button
    //             onClick={() => setCurrentView(3)}
    //             className="text-primarySixTwo text-sm font-semibold"
    //           >
    //             Attendance
    //           </button>
    //         </div>
    //         <div className="w-full grid grid-cols-[1fr_2fr_1.5fr] grid-rows-1 items-center gap-8">
    //           <h3 className="w-fit text-white text-xl font-bold">Python 001</h3>
    //           <p className="w-fit text-xs font-semibold">
    //             October 1, 10:47AM-11:47AM
    //           </p>
    //           <p className="w-fit text-xs font-semibold">
    //             Co-host: Raymond A. Amem
    //           </p>
    //         </div>
    //       </div>
    //       <div className="w-full h-full  _bg-gray-700 relative grid grid-rows-[auto_1fr] grid-cols-1 px-4 rounded-sm !border-[0.1px] border-white">
    //         <header className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center pt-4 pb-2 !border-b-[0.1px] border-white">
    //           <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
    //             Students Name
    //           </span>
    //           <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
    //             Duration
    //           </span>
    //           <span className="flex justify-center items-center w-full h-fit text-xs font-semibold">
    //             Status
    //           </span>
    //         </header>
    //         <ScrollArea className="scrollbar-hide block w-full !h-[350px]">
    //           <ul className="w-full h-fit">
    //             {ViewStudentsAttendance.map((students) => (
    //               <li
    //                 key={students.toString()}
    //                 className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center items-center py-3 !border-b-[0.1px] border-[#8080808e]"
    //               >
    //                 <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
    //                   Raymond{students} A. Amem
    //                 </span>
    //                 <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
    //                   {students} Minutes
    //                 </span>
    //                 <span className="flex justify-center items-center w-full h-fit text-xs text-ellipsis">
    //                   {students % 2 ? "Present" : "Absent"}
    //                 </span>
    //               </li>
    //             ))}
    //           </ul>
    //         </ScrollArea>
    //       </div>
    //     </div>
    //   )}
    //   {scheduleSession && (
    //     <div className="wrapper w-full h-fit grid grid-cols-1 grid-rows-[auto_1fr] gap-2">
    //       <button
    //         onClick={() => setCurrentView(1)}
    //         className="block w-fit text-white text-sm font-semibold px-4"
    //       >
    //         Schedule your live session
    //       </button>
    //       <div className={`w-full min-h-full px-4 py-4`}>
    //         <form onSubmit={handleMsgSubmit}>
    //           <div className="flex justify-between items-center gap-4 mb-8 maxScreenMobile:flex-col">
    //             <div className="w-[50%] maxScreenMobile:w-full">
    //               <input
    //                 type="text"
    //                 id="name"
    //                 name="name"
    //                 value={values.msgName}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgName: e.target.value });
    //                 }}
    //                 className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgName !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} _text-white indent-4`}
    //                 placeholder="Session title"
    //                 required
    //               />
    //             </div>
    //             <div className="w-[50%] h-fit maxScreenMobile:w-full">
    //               <select
    //                 id="reason"
    //                 value={values.msgReason}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgReason: e.target.value });
    //                 }}
    //                 className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
    //               >
    //                 <option value="" disabled>
    //                   Select course
    //                 </option>
    //                 <option value="Perfomance issues">
    //                   Slow platform and frequent lags
    //                 </option>

    //                 <option value="Technical bugs">Frequent crashes</option>

    //                 <option value="Interface design issues">
    //                   Difficulty in navigation and design
    //                 </option>

    //                 <option value="Compatibility issues">
    //                   Poor compatibility with operating systems or device
    //                 </option>

    //                 <option value="UPload/Download problems">
    //                   Problems uploading or downloading file
    //                 </option>

    //                 <option value="Features request">
    //                   Missing essential features
    //                 </option>

    //                 <option value="Customer Support">
    //                   Slow or unhelpful customer support
    //                 </option>

    //                 <option value="Account Management">
    //                   Difficulties with account settings or access
    //                 </option>

    //                 <option value="Security Concerns">
    //                   Concerns about data security and privacy
    //                 </option>

    //                 <option value="Other">Other messages</option>
    //               </select>
    //             </div>
    //           </div>
    //           <div className="flex justify-between items-end gap-4 mb-8 maxScreenMobile:flex-col">
    //             <div className="w-[50%] maxScreenMobile:w-full">
    //               <input
    //                 type="text"
    //                 id="phone"
    //                 name="phone"
    //                 inputMode="numeric"
    //                 value={values.msgPhone}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgPhone: e.target.value });
    //                 }}
    //                 className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgPhone !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4`}
    //                 placeholder="Date"
    //                 required
    //               />
    //             </div>
    //             <div className="w-[50%] maxScreenMobile:w-full">
    //               <input
    //                 type="text"
    //                 id="phone"
    //                 name="phone"
    //                 inputMode="numeric"
    //                 value={values.msgPhone}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgPhone: e.target.value });
    //                 }}
    //                 className={`block w-full text-sm bg-transparent border-[1px] border-solid ${values.msgPhone !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4`}
    //                 placeholder="Time"
    //                 required
    //               />
    //             </div>

    //             {/* <div className="w-[50%] h-fit maxScreenMobile:w-full">
    //               <select
    //                 id="reason"
    //                 value={values.msgReason}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgReason: e.target.value });
    //                 }}
    //                 className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
    //               >
    //                 <option value="" disabled>
    //                   Reason for writing?
    //                 </option>
    //                 <option value="Perfomance issues">
    //                   Slow platform and frequent lags
    //                 </option>

    //                 <option value="Technical bugs">Frequent crashes</option>

    //                 <option value="Interface design issues">
    //                   Difficulty in navigation and design
    //                 </option>

    //                 <option value="Compatibility issues">
    //                   Poor compatibility with operating systems or device
    //                 </option>

    //                 <option value="UPload/Download problems">
    //                   Problems uploading or downloading file
    //                 </option>

    //                 <option value="Features request">
    //                   Missing essential features
    //                 </option>

    //                 <option value="Customer Support">
    //                   Slow or unhelpful customer support
    //                 </option>

    //                 <option value="Account Management">
    //                   Difficulties with account settings or access
    //                 </option>

    //                 <option value="Security Concerns">
    //                   Concerns about data security and privacy
    //                 </option>

    //                 <option value="Other">Other messages</option>
    //               </select>
    //             </div> */}
    //           </div>

    //           <div className="grid grid-cols-[1fr_1fr] grid-rows-[1fr] gap-4 mb-8 maxScreenMobile:grid-cols-1 maxScreenMobile:grid-rows-2">
    //             <div className="w-full h-fit">
    //               <div className="w-full h-fit mb-6">
    //                 <select
    //                   id="reason"
    //                   value={values.msgReason}
    //                   onChange={(e) => {
    //                     setValues({ ...values, msgReason: e.target.value });
    //                   }}
    //                   className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
    //                 >
    //                   <option value="" disabled>
    //                     Duration
    //                   </option>
    //                   <option value="Perfomance issues">
    //                     Slow platform and frequent lags
    //                   </option>

    //                   <option value="Technical bugs">Frequent crashes</option>

    //                   <option value="Interface design issues">
    //                     Difficulty in navigation and design
    //                   </option>

    //                   <option value="Compatibility issues">
    //                     Poor compatibility with operating systems or device
    //                   </option>

    //                   <option value="UPload/Download problems">
    //                     Problems uploading or downloading file
    //                   </option>

    //                   <option value="Features request">
    //                     Missing essential features
    //                   </option>

    //                   <option value="Customer Support">
    //                     Slow or unhelpful customer support
    //                   </option>

    //                   <option value="Account Management">
    //                     Difficulties with account settings or access
    //                   </option>

    //                   <option value="Security Concerns">
    //                     Concerns about data security and privacy
    //                   </option>

    //                   <option value="Other">Other messages</option>
    //                 </select>
    //               </div>

    //               <div className="w-full h-fit">
    //                 <select
    //                   id="reason"
    //                   value={values.msgReason}
    //                   onChange={(e) => {
    //                     setValues({ ...values, msgReason: e.target.value });
    //                   }}
    //                   className={`${bg} border-[1px] ${values.msgReason !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md ${text} block w-full text-sm py-[0.5rem] pl-3`}
    //                 >
    //                   <option value="" disabled>
    //                     Add Co-host
    //                   </option>
    //                   <option value="Perfomance issues">
    //                     Slow platform and frequent lags
    //                   </option>

    //                   <option value="Technical bugs">Frequent crashes</option>

    //                   <option value="Interface design issues">
    //                     Difficulty in navigation and design
    //                   </option>

    //                   <option value="Compatibility issues">
    //                     Poor compatibility with operating systems or device
    //                   </option>

    //                   <option value="UPload/Download problems">
    //                     Problems uploading or downloading file
    //                   </option>

    //                   <option value="Features request">
    //                     Missing essential features
    //                   </option>

    //                   <option value="Customer Support">
    //                     Slow or unhelpful customer support
    //                   </option>

    //                   <option value="Account Management">
    //                     Difficulties with account settings or access
    //                   </option>

    //                   <option value="Security Concerns">
    //                     Concerns about data security and privacy
    //                   </option>

    //                   <option value="Other">Other messages</option>
    //                 </select>
    //               </div>
    //             </div>

    //             <div className="w-full h-full">
    //               <input
    //                 type="file"
    //                 accept=".ppt"
    //                 id="phone"
    //                 name="phone"
    //                 inputMode="numeric"
    //                 value={values.msgPhone}
    //                 onChange={(e) => {
    //                   setValues({ ...values, msgPhone: e.target.value });
    //                 }}
    //                 className={`block w-full h-full text-sm bg-transparent border-[1px] border-solid ${values.msgPhone !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-2 ${text} indent-4 relative before:block before:absolute before:z-10 before:top-0 before:left-0 before:bottom-0 before:right-0 before:bg-black`}
    //                 placeholder="Add slide"
    //                 required
    //               />
    //             </div>
    //           </div>

    //           <div className=" mb-8">
    //             <textarea
    //               name="message"
    //               id="message"
    //               cols={30}
    //               rows={5}
    //               value={values.msg}
    //               placeholder="Note/Occupation (Otional)"
    //               onChange={(e) => {
    //                 setValues({ ...values, msg: e.target.value });
    //               }}
    //               className={`block w-full text-sm !h-32 bg-transparent border-[1px] border-solid ${values.msg !== "" ? "!border-[#FFA500]" : `${border}`} rounded-md py-1 indent-4 resize-none ${text}`}
    //             ></textarea>
    //           </div>
    //         </form>

    //         <div className="flex justify-between items-center">
    //           <button
    //             type="button"
    //             onClick={handleBackword}
    //             className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
    //           >
    //             Back
    //           </button>
    //           <Link
    //             to={"#"}
    //             onClick={() => alert("Session created successfully")}
    //             className="flex justify-center items-center w-fit h-fit text-xs font-semibold py-1.5 px-6 text-primaryTwo bg-primaryThree rounded-sm"
    //           >
    //             Schedule
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </CourseOverviewRoot>