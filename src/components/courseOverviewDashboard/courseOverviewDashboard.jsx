import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import CourseOverviewHeader from "./subComponents/header";
import { Bell } from "lucide-react";
import { CiSettings } from "react-icons/ci";
import { PiStudentLight } from "react-icons/pi";
import { TiMessages } from "react-icons/ti";

export default function CourseDashboardOverviewPage() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const navItems = [
    { title: "Dashboard", link: "/course/overview/dashboard" },
    { title: "Presentations", link: "#" },
    { title: "My Courses", link: "#" },
    { title: "Live Sessions", link: "#" },
    { title: "Students", link: "#" },
    { title: "Messages", link: "#" },
    { title: "Earnings", link: "#" },
    { title: "Settings", link: "#" }
  ];

  return (
    <section className="h-screen w-full bg-black text-white grid grid-cols-1 grid-rows-[auto_1fr]">
      <CourseOverviewHeader />
      <div className="h-full grid grid-cols-[300px_1fr] grid-rows-1">
        <div className="aside bg-primaryTwo h-full grid grid-cols-1 grid-rows-[auto_1fr_auto] p-2">
          <h3 className="w-full min-h-24 font-semibold text-3xl text-white">
            Welcome Back, Raymond
          </h3>
          <nav className="w-full h-full flex flex-col justify-start items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.link}
                onClick={() => setActiveNav(item.title)}
                className={`block w-full h-fit p-3 text-left border-none rounded-sm transition-colors ${
                  activeNav === item.title
                    ? "bg-gradient-to-r from-primarySixTwo to-primaryTwo text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
          <Link to={"/ddd"}>Log-out</Link>
        </div>

        <main className="w-full h-full grid grid-cols-1 grid-rows-[auto_1fr] gap-2 p-2 pt-0">
          <div className="main-header bg-primaryTwo flex flex-col gap-3 p-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-2xl">
                Hi, Raymond Amem Aondoakura
              </h2>
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
                <p className="text-white text-sm">
                  You have 2 new notifications.{" "}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
                  Upload Slides
                </button>
                <button className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
                  Schedule Live Session
                </button>
                <button className="bg-white text-primaryTwo text-xs px-3 py-2 rounded-md">
                  Create New Course
                </button>
              </div>
            </div>
          </div>
          {/* different wrappers */}
          <div className="wrapper w-full h-full grid grid-cols-1 grid-rows-[1fr_1fr] gap-2">
            <div className="analyticsOverview grid grid-cols-3 grid-rows-1 gap-2 w-full h-full">
              <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between">
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
              <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between">
                <h3 className="text-2xl font-semibold">
                  Total Enrolled Students
                </h3>
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
              <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between">
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
              <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 flex flex-col justify-between">
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
              <div className="w-full h-full border-none rounded-sm bg-gradient-to-b from-primarySixTwo to-primaryTwo p-4 grid grid-cols-1 grid-rows-[auto_1fr_auto] gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold w-fit">Messages</h3>
                  <span className="opacity-75 inline-block">
                    Latest Messages
                  </span>
                </div>
                <div className="wrap_latest_mesgs flex flex-col gap-2">
                  <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                    <span className="block w-fit opacity-75">
                      John Joe
                    </span>
                    <span className="block w-fit opacity-75">
                      I'm having trouble in...
                    </span>
                    <span className="block w-fit opacity-75">
                      20 Jul
                    </span>
                  </p>
                  <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                    <span className="block text-xs opacity-75">
                      John Joe
                    </span>
                    <span className="block w-fit text-xs opacity-75">
                      I'm having trouble in...
                    </span>
                    <span className="block w-fit text-xs opacity-75">
                      20 Jul
                    </span>
                  </p>
                  <p className="text-sm opacity-90 flex justify-between items-center !border-b-[0.5px] border-b-white pb-2">
                    <span className="block w-fit text-xs opacity-75">
                      John Joe
                    </span>
                    <span className="block w-fit text-xs opacity-75">
                      I'm having trouble in...
                    </span>
                    <span className="block w-fit text-xs opacity-75">
                      20 Jul
                    </span>
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
          {/* end different wrappers */}
        </main>
      </div>
    </section>
  );
}
