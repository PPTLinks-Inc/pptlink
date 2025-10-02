import { useState, useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { UtilityProvider } from "../../contexts/utilityContext";
import { useTheme } from "../../hooks/useTheme";
import CourseOverviewRoot from "./courseOverviewRoot";
import { ScrollArea } from "@/components/ui/scroll-area";
const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);

export default function CourseOverviewMessages() {
  const [search, setSearch] = useState("");
  const { search: globalSearch } = useContext(UtilityProvider);
  const { bg, text, border } = useTheme();

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
        {/* search */}
        <div
          className={`w-full h-fit mb-4`}
        >
          <span
            className={`block w-fit ${text} text-[#FFFFF0] $ _currentView == 3 && "text-primaryTwo"} text-[1.3rem]  absolute right-2 top-[50%] translate-y-[-50%] pointer-events-none`}
          >
            <CiSearch />
          </span>
        </div>

        <div className="w-full h-full  _bg-gray-700 relative grid grid-rows-[auto_1fr] grid-cols-1 rounded-sm !border-[0.1px] border-white">
          <ScrollArea className="scrollbar-hide block w-full !h-[410px]">
            <ul className="w-full h-fit">
              {ViewStudents.map((students) => (
                <li
                  key={students.toString()}
                  className="w-full h-fit grid grid-cols-3 grid-rows-1 justify-center items-center py-4 px-2 !border-b-[0.1px] border-[#8080808e]"
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
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </ScrollArea>
    </CourseOverviewRoot>
  );
}
