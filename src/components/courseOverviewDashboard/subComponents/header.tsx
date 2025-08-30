import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { RxAvatar } from "react-icons/rx";
import logo_orange from "/imgs/onemorecolor.png";

export default function CourseOverviewHeader() {
  const [openProfil, setOpenProfile] = useState(false);

  return (
    <header className="bg-black text-white w-full h-fit">
      <nav className="w-[98%] mx-auto h-fit flex justify-between items-center py-2">
        <Link to={"/"} className="inline-flex items-center gap-1">
          <img
            src={logo_orange}
            alt={logo_orange}
            className="w-5 aspect-square"
          />
          <span className="text-lg font-semibold inline-block">PPTLinks</span>
        </Link>
        <div className="flex justify-between items-center gap-4">
          <button>
            {" "}
            <span className="block relative">
              <Bell size={24} />{" "}
              <span className="block absolute -top-1 -right-1 bg-primarySixTwo rounded-full w-1.5 h-1.5"></span>
            </span>
          </button>
          <button
            onClick={() => setOpenProfile(!openProfil)}
            className="relative"
          >
            <span>
              <RxAvatar size={24} />
            </span>
            <div
              className={`absolute top-full right-0 w-44 h-fit !bg-white !text-black border-none rounded-md ${openProfil ? "flex" : "hidden"} flex-col justify-between items-start gap-1`}
            >
              <Link to={"#"} className="block w-full text-left p-2">
                User Dashboard
              </Link>
              <hr className="border-[0.1rem] border-primaryTwo block w-full" />
              <Link to={"#"} className="block w-full text-left p-2">
                Settings
              </Link>
            </div>
          </button>
        </div>
      </nav>
    </header>
  );
}
