/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import "./interface.css";
import { FaHome, FaDownload } from "react-icons/fa";
import { useState, useContext } from "react";
import Header from "./layout/Header";
import { Carousel } from "./layout/Carousel";
import { LoadingAssetBig2 } from "../../assets/assets";
import { isIOS } from "react-device-detect";

import { Spinner, SpinnerIos } from "./layout/assets/spinner/Spinner";
import PresentationNotFound from "./404";
import { PresentationContext } from "../../contexts/presentationContext";
import Chat from "./layout/Chat";

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
];
let mobileHeader;

if (window.innerWidth < 900) {
  mobileHeader = false;
} else {
  mobileHeader = true;
}

function Interface() {
  const { presentation, notFound } = useContext(PresentationContext);
  const [navbar, setNavbar] = useState(false);

  return !notFound ? (
    <main
      className={`overflow-hidden min-h-screen  relative duration-300 transition-all bg-black md:overflow-auto `}
    >
      {mobileHeader && <Header />}
      {/* navigation */}
      {/* body */}
      <section
        className={`main-body ${navbar ? "" : "active"} w-full ${
          mobileHeader && "px-0"
        }  rounded-2xl relative  transition-all duration-500 bg-white`}
      >
        {presentation ? (
          <div className=" h-fit min-h-[100%]">
            {presentation.live || presentation.User === "HOST" ? (
              <Carousel nav={{ navbar, setNavbar, navItems }} />
            ) : !isIOS ? (
              <Spinner />
            ) : (
              <SpinnerIos />
            )}
            <Chat />
          </div>
        ) : (
          <div className="w-full h-[85vh] flex justify-center bg-black items-center">
            <LoadingAssetBig2 />
          </div>
        )}
      </section>
    </main>
  ) : (
    <PresentationNotFound />
  );
}

export default Interface;
