import { Link } from "react-router-dom";
import { PiStudentLight } from "react-icons/pi";
import { TiMessages } from "react-icons/ti";
import CourseOverviewRoot from "./courseOverviewRoot";

export default function CourseDashboardOverviewPage() {
  return (
    <CourseOverviewRoot>
      <div className="wrapper w-full h-full grid grid-cols-1 grid-rows-[1fr_1fr] gap-2">
        <div className="analyticsOverview grid grid-cols-3 grid-rows-1 gap-2 w-full h-full">
          <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo py-4 px-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold">Upcoming Classes</h3>
            <div className="w-full flex flex-col">
              <p className="text-xl opacity-90">
                <span>Python 002</span>
              </p>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm opacity-90">
                  <span className="text-xs opacity-75">
                    October 1, 10:00 AM
                  </span>
                </p>
                <Link
                  to={"#"}
                  className="underline text-sm mt-2 text-orange-600 transition-colors"
                >
                  Start Session
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo py-4 px-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold">Total Enrolled Students</h3>
            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-semibold opacity-90 inline-flex items-center gap-2">
                <span>
                  <PiStudentLight size={24} />
                </span>
                <span className="opacity-75">120</span>
              </p>
              <Link
                to={"#"}
                className="underline text-sm mt-2 text-orange-600 transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo py-4 px-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold">Active Courses</h3>
            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-semibold opacity-90 inline-flex items-center gap-2">
                <span>
                  <PiStudentLight size={24} />
                </span>
                <span className="opacity-75">50</span>
              </p>
              <Link
                to={"#"}
                className="underline text-sm mt-2 text-orange-600 transition-colors"
              >
                Create New Course
              </Link>
            </div>
          </div>
        </div>
        <div className="analyticsOverviewBottom w-full h-full grid grid-cols-[400px_1fr] grid-rows-1 gap-2">
          <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo py-4 px-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold">Earnings</h3>
            <div className="w-full flex flex-col">
              <p className="text-xl opacity-90">
                <span>${"11,250"}</span>
              </p>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm opacity-90">
                  <span className="text-xs opacity-75">
                    ${"1,000 Monthly Average"}
                  </span>
                </p>
                <Link
                  to={"#"}
                  className="underline text-sm mt-2 text-orange-600 transition-colors"
                >
                  Request Withdrawal
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo py-4 px-6 grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold w-fit">Messages</h3>
              <span className="opacity-75 inline-block">Latest Messages</span>
            </div>
            <div className="wrap_latest_mesgs flex flex-col gap-2">
              <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                <span className="block w-fit opacity-75">John Joe</span>
                <span className="block w-fit opacity-75">
                  I&apos;m having trouble in...
                </span>
                <span className="block w-fit opacity-75">20 Jul</span>
              </p>
              <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                <span className="block text-xs opacity-75">John Joe</span>
                <span className="block w-fit text-xs opacity-75">
                  I&apos;m having trouble in...
                </span>
                <span className="block w-fit text-xs opacity-75">20 Jul</span>
              </p>
              <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                <span className="block w-fit text-xs opacity-75">John Joe</span>
                <span className="block w-fit text-xs opacity-75">
                  I&apos;m having trouble in...
                </span>
                <span className="block w-fit text-xs opacity-75">20 Jul</span>
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-2xl font-semibold opacity-90 inline-flex items-center gap-2">
                <span>
                  <TiMessages size={24} />
                </span>
                <span className="opacity-75">10</span>
              </p>
              <Link
                to={"#"}
                className="underline text-sm mt-2 text-orange-600 transition-colors"
              >
                Send Course Mail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CourseOverviewRoot>
  );
}
