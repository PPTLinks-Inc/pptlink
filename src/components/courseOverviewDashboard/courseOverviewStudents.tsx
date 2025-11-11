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
              <ScrollArea className="scrollbar-hide block w-full !h-[410px]">
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
