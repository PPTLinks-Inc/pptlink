/* eslint-disable no-unused-vars */

import "./interface.css";
import { FaHome, FaDownload, FaSync } from "react-icons/fa";
import { useState } from "react";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";

const navItems = [
  {
    name: "download",
    icon: <FaDownload className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaHome className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "sync",
    icon: <FaSync className="text-2xl relative z-10" />,
    link: "/",
  },
];
let mobileHeader;

if (window.innerWidth < 900) {
  mobileHeader = false;
} else {
  mobileHeader = true;
}

function Interface() {
  const [navbar, setNavbar] = useState(false);

  const handleNavBar = (item) => {
    setNavbar(item);
  };

  return (
    <main
      className={`overflow-hidden min-h-screen  relative duration-300 transition-all bg-black md:overflow-auto `}
    >
      {mobileHeader && <Header handleNavBar={handleNavBar} />}
      {/* navigation */}
      {/* body */}
      <section
        className={`main-body ${navbar ? "" : "active"} w-full ${
          mobileHeader && "px-0"
        }  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        <div className=" h-fit min-h-[100%]">
          <Carousel nav={{ navbar, setNavbar, navItems }} />
        </div>
      </section>
    </main>
  );
}

export default Interface;
