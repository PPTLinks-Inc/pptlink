/* eslint-disable no-unused-vars */

import "./interface.css";
import {
  FaUser,
  FaHome,
  FaAndroid,
  FaChevronUp,
  FaDownload,
  FaExpand,
} from "react-icons/fa";
import { useState } from "react";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import axios from "axios";
import { Link } from "react-router-dom";

const navItems = [
  {
    name: "home",
    icon: <FaDownload className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaHome className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaUser className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaUser className="text-2xl relative z-10" />,
    link: "/",
  },
  {
    name: "home",
    icon: <FaUser className="text-2xl relative z-10" />,
    link: "/",
  },
];

function Interface() {
  const [navbar, setNavbar] = useState(false);

  const handleNavBar = (item) => {
    setNavbar(item);
  };

  return (
    <main
      className={`overflow-hidden min-h-screen  relative duration-300 transition-all bg-black md:overflow-auto `}
    >
      <Header handleNavBar={handleNavBar} />
      {/* navigation */}
      {/* body */}
      <section
        className={`main-body ${
          navbar ? "" : "active"
        } w-full  px-2  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        <div className=" h-fit min-h-[100%] px-8">
          <Carousel nav={{ navbar, setNavbar, navItems }} />
        </div>
      </section>
    </main>
  );
}

export default Interface;
