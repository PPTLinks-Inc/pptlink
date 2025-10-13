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

  const handleMessageView = (currentView: string): string => {
    setMessageView((prev) => ({
      ...prev,
      view: !prev.view,
      value: currentView
    }));
    setView({
      listOfAllStudents: true,
      studentTutorChats: false,
      listOfCourseMessages: false,
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
          className={`w-fit h-fit mb-4 flex justify-start items-center gap-4`}
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
            onClick={() =>
              setView({
                listOfAllStudents: false,
                studentTutorChats: false,
                listOfCourseMessages: true,
                courseMessage: false
              })
            }
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
