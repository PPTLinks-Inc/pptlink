import { useContext } from "react";
import { Bell } from "lucide-react";
import { CiSettings } from "react-icons/ci";
import { CourseOverview } from "@/contexts/courseOverviewContext";

export default function InnerMainHeader() {
    const { handleScheduleSession } = useContext(CourseOverview);

  return (
    <div className="main-header bg-primaryTwo flex flex-col gap-3 p-2">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Hi, Raymond Amem Aondoakura</h2>
        <button className={`text-3xl font-bold $_{text} _text-[#FFFFF0]`}>
          <CiSettings />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-4">
          <span className="block relative">
            <Bell />{" "}
            <span className="block absolute -top-[0.09rem] -right-[0.09rem] bg-primarySixTwo rounded-full w-1.5 h-1.5"></span>
          </span>
          <p className="text-white text-sm">You have 2 new notifications. </p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <button className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
            Upload Slides
          </button>
          <button onClick={handleScheduleSession} className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
            Schedule Live Session
          </button>
          <button className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
            Create New Course
          </button>
        </div>
      </div>
    </div>
  );
}
