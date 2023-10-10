/* eslint-disable no-unused-vars */

import "./interface.css";
import { FaHome, FaDownload, FaSync } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import axios from "axios";

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
  const controller = new AbortController();
  const [navbar, setNavbar] = useState(false);
  const [loading, setLoading] = useState(true);

  const [presentation, setPresentation] = useState(null);

  const params = useParams();

  const handleNavBar = (item) => {
    setNavbar(item);
  };

  useEffect(() => {
    axios
      .get(`/api/v1/ppt/presentations/present/${params.id}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        controller.abort();
        setPresentation(data.presentation);
        setLoading(false);
        console.log(data.presentation);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

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
        {presentation && (
          <div className=" h-fit min-h-[100%]">
            {presentation.live || presentation.User === "HOST" ? (
              <Carousel
                nav={{ navbar, setNavbar, navItems }}
                slides={presentation.imageSlides}
              />
            ) : (
              <p className="text-8xl text-center">Presentation not live</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Interface;
