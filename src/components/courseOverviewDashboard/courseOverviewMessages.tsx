import { useTheme } from "../../hooks/useTheme";
import CourseOverviewRoot from "./courseOverviewRoot";
import { ScrollArea } from "@/components/ui/scroll-area";
const ViewStudents = Array.from({ length: 16 }, (_, i) => i + 1);

export default function CourseOverviewMessages() {
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
        <div
          className={`w-fit h-fit mb-6 flex justify-start items-center gap-4`}
        >
          <select
            title="Select Message Type"
            name="messages"
            className={`flex justify-start items-center gap-2 w-fit h-fit ${bg} ${text} text-sm ${border} border-[0.1px] rounded-md py-2 px-6 cursor-pointer`}
          >
            <option
              className={`w-full h-full ${bg} text-${text} text-sm border-none outline-none placeholder:text-${text}`}
            >
              All Messages
            </option>
            <option
              className={`w-full h-full ${bg} text-${text} text-sm border-none outline-none placeholder:text-${text}`}
            >
              Students
            </option>
            <option
              className={`w-full h-full ${bg} text-${text} text-sm border-none outline-none placeholder:text-${text}`}
            >
              Tutors
            </option>
          </select>
          <button
            type="button"
            className={`inline-block w-fit h-fit bg-[#FFFFF0] text-black text-sm border-none rounded-md py-2 px-3 mb-2`}
          >
            Course Messages
          </button>
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
